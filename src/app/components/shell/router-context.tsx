import {useErrorBoundary} from 'preact/hooks';
import * as Sentry from '@sentry/react';
import recoverFromStaleChunk from '~/helpers/stale-chunk';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue() {
    // Without a handler, useErrorBoundary swallows every render error in the
    // route tree and Sentry never sees it.
    useErrorBoundary((error) => {
        if (!recoverFromStaleChunk(error)) {
            Sentry.captureException(error);
        }
    });

    return {};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as RouterContextProvider};
