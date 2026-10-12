import * as Sentry from '@sentry/react';
import {isEmbedScriptUrl} from '~/components/jsx-helpers/activate-scripts';
import isSupported from '~/helpers/device';
import {denyUrls, isIgnoredMessage, isFromDeniedScheme, isFromDeniedUrl} from '~/helpers/exception-filters';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const packageVersion = require('../../package.json').version;

// Sentry-only: it substring-matches these against the whole exception value,
// which is too broad to share with PostHog. See helpers/exception-filters.
const ignoreErrors = [
    'TypeError: Failed to fetch',
    'TypeError: Load failed',
    'TypeError: NetworkError when attempting to fetch resource.',
    'TypeError: cancelled',
    'TypeError: Cancelled',
    'TypeError: e is undefined',
    'TypeError: Cannot read properties of undefined (reading \'default\')',
    'TypeError: Cannot read property \'default\' of undefined',
    'TypeError: can\'t access dead object',
    'TypeError: null is not an object (evaluating \'this.parentNode.style\')',
    'TypeError: Cannot read properties of null (reading \'style\')',
    'UnhandledRejection: Non-Error promise rejection captured with value: Failed to load Google Analytics',
    'UnhandledRejection: Non-Error promise rejection captured with value: undefined',
    'TypeError: Cannot read properties of null (reading \'render\')',
    'TypeError: h is not a function. (In \'h("Could not load ".concat(e))\', \'h\' is undefined)',
    'SyntaxError: Unexpected token \'<\'',
    'SyntaxError: expected expression, got \'<\'',
    'message: cancelled',
    'cancelled',
    'Error: Different window already linked for window: _blank',
    'Error: Failed to load Google Analytics',
    'NS_ERROR_FAILURE: No error message',
    'SecurityError: The operation is insecure.', // Safari with disabled localStorage
    'URIError: URI malformed'
];

function exceptionValue(event) {
    const values = event.exception?.values;

    return values?.length ? values[0].value : '';
}

function frameFilenames(event) {
    return (event.exception?.values ?? [])
        .flatMap((value) => value.stacktrace?.frames ?? [])
        .map((frame) => frame.filename || '');
}

// A rejected promise carrying a non-Error has no `message`, so reading only
// hint.originalException misses it. Sentry still records the rejected value as
// the exception value, which is what the ignore list needs to see.
function messageOf(event, error) {
    const value = error?.message || exceptionValue(event);

    return typeof value === 'string' ? value : '';
}

function scriptUrls(event) {
    return (event.exception?.values ?? [])
        .flatMap((value) => value.stacktrace?.frames ?? [])
        .map((frame) => frame.filename)
        .filter((url) => (/^(blob:)?[a-z-]+:\/\//).test(url));
}

// Sentry's Safari and Firefox stack parser drops the blob: prefix from a frame
// it reads, leaving https://origin/<uuid>, so the lookup has to put it back.
function isCmsEmbed(url) {
    return isEmbedScriptUrl(url) || isEmbedScriptUrl(`blob:${url}`);
}

// Our bundles live under /dist/, and CMS embeds run from blob: URLs that
// activate-scripts records. GTM tags run inline, so their frames carry the
// page's URL, and we keep those. A stack made only of other origins (vendor
// CDNs, extensions) is dropped. denyUrls can't do this because it checks the
// top frame alone.
function isFromOtherScripts(urls) {
    const origin = window.location.origin;

    if (urls.some((url) => url.startsWith(`${origin}/dist/`) || isCmsEmbed(url))) {
        return false;
    }
    // Chrome and the Google app on iOS inject scripts that report the page's URL
    if ((/CriOS|GSA\//).test(window.navigator.userAgent)) {
        return urls.length > 0;
    }
    return urls.length > 0 && !urls.some((url) => url.startsWith(`${origin}/`));
}

// eslint-disable-next-line complexity
function beforeSend(event, hint) {
    const message = messageOf(event, hint?.originalException);
    const urls = scriptUrls(event);

    if (isFromOtherScripts(urls)) {
        return null;
    }
    if (urls.some(isCmsEmbed)) {
        event.tags = {...event.tags, 'cms_embed': true};
    }
    if (!isSupported()) {
        return null;
    }
    if (window.location.pathname.startsWith('/l/') || window.location.pathname.startsWith('/rex/')) {
        return null;
    }
    if (isIgnoredMessage(message)) {
        return null;
    }
    if (isFromDeniedScheme(frameFilenames(event))) {
        return null;
    }
    if (isFromDeniedUrl(frameFilenames(event))) {
        return null;
    }
    if (message.match(/mce-visual-caret/i)) {
        return null;
    }
    if (message.match(/unexpected token/i)) {
        event.fingerprint = ['unexpected token'];
    }
    if (message.match(/unexpected (eof|end)/i)) {
        event.fingerprint = ['unexpected end'];
    }
    if (message.match(/pulseinsights/i)) {
        event.fingerprint = ['pulseinsights'];
    }
    if (message.match(/localStorage/)) {
        event.fingerprint = ['localStorage'];
    }
    return event;
}

Sentry.init({
    // Off everywhere but production. Disabling only in beforeSend would still
    // let session envelopes through, which skews release health.
    enabled: window.location.hostname === 'openstax.org',
    dsn: 'https://68df3e19624c434eb975dafa316c03ff@o484761.ingest.sentry.io/5691260',
    release: `osweb@${process.env.RELEASE_VERSION || packageVersion}`,
    integrations: [Sentry.extraErrorDataIntegration()],
    environment: window.location.hostname,
    ignoreErrors,
    denyUrls,
    beforeSend
});
