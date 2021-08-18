import {useReducer, useLayoutEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue() {
    const [value, dispatch] = useReducer(() => document.activeElement);
    const blurHandler = ({relatedTarget}) => {
        if (!relatedTarget) {
            dispatch();
        }
    };

    useLayoutEffect(() => {
        document.addEventListener('focus', dispatch, true);
        document.addEventListener('blur', blurHandler, true);
        dispatch();

        return () => {
            document.removeEventListener('focus', dispatch, true);
            document.removeEventListener('blur', blurHandler, true);
        };
    }, []);

    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as ActiveElementContextProvider
};
