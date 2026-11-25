import React from 'react';

export type FlagValue = string | boolean | undefined;

type Properties = Record<string, unknown>;

type PostHogClient = {
    __loaded?: boolean;
    getFeatureFlag: (key: string) => FlagValue;
    onFeatureFlags: (cb: () => void) => (() => void) | undefined;
    capture: (event: string, properties?: Properties) => void;
    identify: (uuid: string, properties?: Properties) => void;
    setPersonProperties: (properties: Properties) => void;
    get_property: (name: string) => unknown;
    reset: () => void;
    register: (properties: Properties) => void;
};

const POLL_START_MS = 250;
const POLL_MAX_MS = 5000;

// Loaded by GTM, so it may not be present yet (pre-consent). Before the SDK
// initializes, `window.posthog` is a stub that queues calls and returns nothing,
// so only a client with `__loaded` set is usable.
function getPostHog(): PostHogClient | undefined {
    const posthog = (window as unknown as {posthog?: PostHogClient}).posthog;

    return posthog?.__loaded ? posthog : undefined;
}

// PostHog has no "loaded" event, so poll with a growing delay. Returns a cancel.
export function whenPostHogLoads(callback: (posthog: PostHogClient) => void) {
    let timer: number | undefined;
    let delay = POLL_START_MS;
    const attempt = () => {
        const posthog = getPostHog();

        if (posthog) {
            callback(posthog);
            return;
        }
        timer = window.setTimeout(attempt, delay);
        delay = Math.min(delay * 2, POLL_MAX_MS);
    };

    attempt();
    return () => window.clearTimeout(timer);
}

// Reading a flag auto-fires PostHog's `$feature_flag_called` exposure event.
export function getExperimentVariant(flagKey: string): FlagValue {
    return getPostHog()?.getFeatureFlag(flagKey);
}

/** Fire a goal/auxiliary event. Safe no-op when PostHog is absent. */
export function captureEvent(event: string, properties?: Properties) {
    getPostHog()?.capture(event, properties);
}

/** Attach a property (e.g. a CMS flag cohort) to every event captured from
 *  here on, so any funnel/insight can be sliced by it without new events. */
export function registerProperties(properties: Properties) {
    getPostHog()?.register(properties);
}

// Returns a plain reader rather than a hook per flag so callers can read any
// number of flags, e.g. while filtering a list, without breaking hooks rules.
// Pass `enabled` false when nothing on the page is flagged, so no listener or
// timer is created.
export function useExperimentReader(enabled = true): (flag: string) => FlagValue {
    const [, forceRender] = React.useReducer((n: number) => n + 1, 0);

    React.useEffect(() => {
        if (!enabled) {
            return undefined;
        }
        let unsubscribe: (() => void) | undefined;
        const cancel = whenPostHogLoads((posthog) => {
            unsubscribe = posthog.onFeatureFlags(() => forceRender());
        });

        return () => {
            cancel();
            unsubscribe?.();
        };
    }, [enabled]);
    return getExperimentVariant;
}
