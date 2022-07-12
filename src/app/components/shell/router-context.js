import {useEffect, useState, useCallback} from 'react';
import {useErrorBoundary} from 'preact/hooks';
import buildContext from '~/components/jsx-helpers/build-context';
import {useLocation} from 'react-router-dom';

function useContextValue() {
    const [failCount, setFailCount] = useState(0);
    const [error, resetError] = useErrorBoundary(
        (err) => {
            console.warn('Error boundary error:', err);
            setFailCount(failCount + 1);
            if (failCount > 10) {
                throw new Error(`Too many fails: ${err.toString()}`);
            }
        }
    );
    const [goto404, setGoto404] = useState(false);
    const loc = useLocation();
    const fail = useCallback((info = 'Router force fail') => {
        setGoto404(info);
    }, []);

    useEffect(() => {
        resetError();
        setGoto404();
    }, [loc]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        isValid: !error,
        goto404,
        fail
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as RouterContextProvider
};
