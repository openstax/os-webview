import React from 'react';

export type FlagValue = string | boolean | undefined;

type PostHogClient = {
    getFeatureFlag: (key: string) => FlagValue;
    onFeatureFlags: (cb: () => void) => void;
};

/** PostHog is loaded by GTM; it may not be present yet (pre-consent). */
function getPostHog(): PostHogClient | undefined {
    return (window as unknown as {posthog?: PostHogClient}).posthog;
}

/** Read an experiment/feature-flag variant. Reading it auto-fires the
 *  `$feature_flag_called` exposure event in PostHog. */
export function getExperimentVariant(flagKey: string): FlagValue {
    return getPostHog()?.getFeatureFlag(flagKey);
}

/** Subscribe to PostHog flag resolution and return a synchronous variant
 *  reader. Re-renders the caller once flags load, so callers can read any
 *  number of flags (e.g. while filtering a list) without breaking hooks rules. */
export function useExperimentReader(): (flag: string) => FlagValue {
    const [, forceRender] = React.useReducer((n: number) => n + 1, 0);

    React.useEffect(() => {
        let interval: number | undefined;

        const subscribe = () => {
            const ph = getPostHog();

            if (!ph) {
                return false;
            }
            ph.onFeatureFlags(() => forceRender());
            return true;
        };

        if (!subscribe()) {
            interval = window.setInterval(() => {
                if (subscribe()) {
                    window.clearInterval(interval);
                }
            }, 250);
        }

        return () => {
            window.clearInterval(interval);
        };
    }, []);
    return getExperimentVariant;
}
