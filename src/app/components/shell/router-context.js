import {useEffect, useCallback} from 'react';
import {useErrorBoundary} from 'preact/hooks';
import buildContext from '~/components/jsx-helpers/build-context';
import {useLocation} from 'react-router-dom';

function useContextValue() {
    const [error, resetError] = useErrorBoundary(
        (err) => console.warn('Error boundary error:', err)
    );
    const loc = useLocation();
    const fail = useCallback((info = 'Router force fail') => {
        throw (new Error(info));
    }, []);

    useEffect(resetError, [loc]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        isValid: !error,
        reset: resetError,
        fail
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as RouterContextProvider
};
