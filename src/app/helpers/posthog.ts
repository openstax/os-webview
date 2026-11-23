import React from 'react';

export type FlagValue = string | boolean | undefined;

type PostHogClient = {
    __loaded?: boolean;
    getFeatureFlag: (key: string) => FlagValue;
    onFeatureFlags: (cb: () => void) => (() => void) | undefined;
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

// Reading a flag auto-fires PostHog's `$feature_flag_called` exposure event.
export function getExperimentVariant(flagKey: string): FlagValue {
    return getPostHog()?.getFeatureFlag(flagKey);
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
        let timer: number | undefined;
        let unsubscribe: (() => void) | undefined;
        let delay = POLL_START_MS;

        const subscribe = () => {
            const ph = getPostHog();

            if (!ph) {
                return false;
            }
            unsubscribe = ph.onFeatureFlags(() => forceRender());
            return true;
        };
        // PostHog has no "loaded" event, so poll with a growing delay.
        const trySubscribe = () => {
            if (subscribe()) {
                return;
            }
            timer = window.setTimeout(trySubscribe, delay);
            delay = Math.min(delay * 2, POLL_MAX_MS);
        };

        trySubscribe();

        return () => {
            window.clearTimeout(timer);
            unsubscribe?.();
        };
    }, [enabled]);
    return getExperimentVariant;
}
