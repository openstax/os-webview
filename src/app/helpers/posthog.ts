import React from 'react';

export type FlagValue = string | boolean | undefined;

type PostHogClient = {
    getFeatureFlag: (key: string) => FlagValue;
    onFeatureFlags: (cb: () => void) => void;
    capture: (event: string, properties?: Record<string, unknown>) => void;
    identify: (uuid: string, properties?: Record<string, unknown>) => void;
    reset: () => void;
    register: (properties: Record<string, unknown>) => void;
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

/** Identify the logged-in user so events/session replay attach to their uuid. */
export function identifyUser(uuid: string, properties?: Record<string, unknown>) {
    getPostHog()?.identify(uuid, properties);
}

/** Clear identity on logout. */
export function resetUser() {
    getPostHog()?.reset();
}

/** Attach a property (e.g. a CMS flag cohort) to every event captured from
 *  here on, so any funnel/insight can be sliced by it without new events. */
export function registerProperties(properties: Record<string, unknown>) {
    getPostHog()?.register(properties);
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
                if (subscribe() && interval !== undefined) {
                    window.clearInterval(interval);
                }
            }, 250);
        }

        return () => {
            if (interval !== undefined) {
                window.clearInterval(interval);
            }
        };
    }, []);
    return getExperimentVariant;
}
