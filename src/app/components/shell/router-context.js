import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue() {
    const [isValid, setIsValid] = useState(true);
    const reset = () => setIsValid(true);

    useEffect(() => {
        window.addEventListener('popstate', reset);

        return () => window.removeEventListener('popstate', reset);
    });

    return {
        isValid,
        reset,
        fail() {setIsValid(false);}
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as RouterContextProvider
};
