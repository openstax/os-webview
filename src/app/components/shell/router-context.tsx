import {useErrorBoundary} from 'preact/hooks';
import * as Sentry from '@sentry/react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue() {
    // Without a handler, useErrorBoundary swallows every render error in the
    // route tree and Sentry never sees it.
    useErrorBoundary((error) => {
        Sentry.captureException(error);
    });

    return {};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as RouterContextProvider};
