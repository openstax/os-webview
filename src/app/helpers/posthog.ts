import React from 'react';

export type FlagValue = string | boolean | undefined;

type PostHogClient = {
    getFeatureFlag: (key: string) => FlagValue;
    onFeatureFlags: (cb: () => void) => void;
    capture: (event: string, properties?: Record<string, unknown>) => void;
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

/** Fire a goal/auxiliary event. Safe no-op when PostHog is absent. */
export function captureEvent(event: string, properties?: Record<string, unknown>) {
    getPostHog()?.capture(event, properties);
}

/** Hook form: returns the variant, re-rendering once PostHog's flags resolve. */
export function useExperiment(flagKey: string): FlagValue {
    const [variant, setVariant] = React.useState<FlagValue>(() =>
        getExperimentVariant(flagKey)
    );

    React.useEffect(() => {
        const ph = getPostHog();
        if (!ph) {
            return;
        }
        ph.onFeatureFlags(() => setVariant(ph.getFeatureFlag(flagKey)));
    }, [flagKey]);

    return variant;
}

/** Subscribe to PostHog flag resolution and return a synchronous variant
 *  reader. Re-renders the caller once flags load, so callers can read any
 *  number of flags (e.g. while filtering a list) without breaking hooks rules. */
export function useExperimentReader(): (flag: string) => FlagValue {
    const [, forceRender] = React.useReducer((n: number) => n + 1, 0);
    React.useEffect(() => {
        const ph = getPostHog();
        if (!ph) {
            return;
        }
        ph.onFeatureFlags(() => forceRender());
    }, []);
    return getExperimentVariant;
}
