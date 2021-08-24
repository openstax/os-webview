import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import {useLocation} from 'react-router-dom';

function useContextValue() {
    const [isValid, setIsValid] = useState(true);
    const reset = () => setIsValid(true);
    const loc = useLocation();

    useEffect(reset, [loc]);

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
