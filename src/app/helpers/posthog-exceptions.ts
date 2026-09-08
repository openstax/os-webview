// PostHog is loaded by a tag inside our GTM container, not by this bundle, so
// the only handle we have on it is `window.posthog` once that tag has run.
import {isIgnoredMessage, isFromDeniedScheme} from './exception-filters';

type ExceptionValue = {
    value?: string;
    stacktrace?: {frames?: {filename?: string}[]};
};

type CaptureResult = {
    event: string;
    properties?: {$exception_list?: ExceptionValue[]};
};

type PostHog = {
    __loaded?: boolean;
    set_config?: (config: {
        before_send: (result: CaptureResult | null) => CaptureResult | null;
    }) => void;
    captureException?: (error: unknown) => void;
};

// GTM injects its tags asynchronously and PostHog then initializes itself, so
// there is nothing to hook until both have happened. Give up after 30s rather
// than poll a page where the tag never fires (K12 portal, blocked GTM).
const POLL_INTERVAL = 500;
const POLL_LIMIT = 60;

type LoadedPostHog = PostHog & {set_config: NonNullable<PostHog['set_config']>};

function loadedPostHog() {
    const posthog = (window as Window & {posthog?: PostHog}).posthog;

    // `__loaded` distinguishes the real library from the snippet's stub, which
    // queues calls but has no config to set.
    return posthog?.__loaded && typeof posthog.set_config === 'function'
        ? (posthog as LoadedPostHog)
        : null;
}

function exceptionsIn(result: CaptureResult) {
    return result.properties?.$exception_list ?? [];
}

function messageOf(result: CaptureResult) {
    return exceptionsIn(result)
        .map((exception) => exception.value)
        .filter((value): value is string => typeof value === 'string')
        .join('\n');
}

function frameFilenamesOf(result: CaptureResult) {
    return exceptionsIn(result)
        .flatMap((exception) => exception.stacktrace?.frames ?? [])
        .map((frame) => frame.filename)
        .filter((filename): filename is string => Boolean(filename));
}

// `before_send` sees every event, so anything that is not an exception has to
// pass straight through or we lose pageviews along with the noise.
export function beforeSend(result: CaptureResult | null) {
    if (!result || result.event !== '$exception') {
        return result;
    }
    if (isIgnoredMessage(messageOf(result))) {
        return null;
    }
    if (isFromDeniedScheme(frameFilenamesOf(result))) {
        return null;
    }

    return result;
}

let filterInstalled = false;

export function installExceptionFilter() {
    if (filterInstalled) {
        return;
    }

    let attempts = 0;
    const poll = window.setInterval(() => {
        const posthog = loadedPostHog();

        attempts += 1;
        if (posthog) {
            filterInstalled = true;
            // eslint-disable-next-line camelcase -- PostHog's config key
            posthog.set_config({before_send: beforeSend});
        }
        if (posthog || attempts >= POLL_LIMIT) {
            window.clearInterval(poll);
        }
    }, POLL_INTERVAL);
}

// Handling a rejection stops it reaching PostHog's unhandled-rejection
// autocapture, so anything we now recover from has to be reported deliberately
// or the failure becomes invisible.
export function captureException(error: unknown) {
    loadedPostHog()?.captureException?.(error);
}
