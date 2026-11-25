import React from 'react';
import * as Sentry from '@sentry/react';
import {captureException} from '~/helpers/posthog-exceptions';
import buildContext from '~/components/jsx-helpers/build-context';
import useUserContext from '~/contexts/user';
import {
    loadPersonalization,
    readStoredPersonalization,
    storePersonalization,
    type Personalization,
    type StoredPersonalization
} from '~/models/personalization';

export type PersonalizationStatus = 'loading' | 'anonymous' | 'ready' | 'error';

// A sessionStorage hydration carries only the stored fields until the fresh response arrives.
export type PersonalizationData = StoredPersonalization &
    Partial<Personalization>;

type Result = {uuid: string; data?: Personalization};

function useFetchedResult(uuid: string | undefined, shouldFetch: boolean) {
    const [result, setResult] = React.useState<Result>();

    React.useEffect(() => {
        if (!shouldFetch || !uuid) {
            return undefined;
        }
        let cancelled = false;
        const finish = (data?: Personalization) => {
            if (!cancelled) {
                setResult({uuid, data});
            }
        };

        loadPersonalization(uuid).then(
            (data) => {
                if (cancelled) {
                    return;
                }
                // The login cookie did not reach sfapi, so its anonymous answer is wrong for this visitor
                if (!data.logged_in) {
                    finish();
                    return;
                }
                storePersonalization(uuid, data);
                finish(data);
            },
            (reason: unknown) => {
                // Handling the rejection hides it from the unhandled-rejection reporters
                const failure =
                    reason instanceof Error ? reason : new Error(String(reason));

                Sentry.captureException(failure);
                captureException(failure);
                finish();
            }
        );

        return () => {
            cancelled = true;
        };
    }, [uuid, shouldFetch]);

    return result?.uuid === uuid ? result : undefined;
}

function deriveState(
    knownAnonymous: boolean,
    result: Result | undefined,
    stored: StoredPersonalization | undefined
): {status: PersonalizationStatus; data?: PersonalizationData} {
    if (knownAnonymous) {
        return {status: 'anonymous'};
    }
    if (result) {
        return result.data
            ? {status: 'ready', data: result.data}
            : {status: 'error'};
    }
    return stored ? {status: 'ready', data: stored} : {status: 'loading'};
}

function useContextValue() {
    const {userLoaded, isLoggedIn, uuid} = useUserContext();
    const loggedIn = Boolean(userLoaded && isLoggedIn && uuid);
    const result = useFetchedResult(uuid, loggedIn);
    const stored = React.useMemo(
        () => (loggedIn && uuid ? readStoredPersonalization(uuid) : undefined),
        [loggedIn, uuid]
    );
    const {status, data} = deriveState(
        Boolean(userLoaded && !isLoggedIn),
        result,
        stored
    );
    const segments = data?.segments;
    const has = React.useCallback(
        (segment: string) => Boolean(segments?.includes(segment)),
        [segments]
    );

    return React.useMemo(() => ({status, data, has}), [status, data, has]);
}

const {useContext, ContextProvider} = buildContext({
    useContextValue,
    defaultValue: {
        status: 'loading' as PersonalizationStatus,
        data: undefined as PersonalizationData | undefined,
        has: (() => false) as (segment: string) => boolean
    }
});

export {
    useContext as default,
    useContext as usePersonalization,
    ContextProvider as PersonalizationContextProvider
};
