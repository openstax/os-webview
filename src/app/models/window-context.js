import {useReducer, useLayoutEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import throttle from 'lodash/throttle';

function getValuesFromWindow() {
    const {innerHeight, innerWidth, scrollY} = window;

    return {innerHeight, innerWidth, scrollY};
}

function useContextValue() {
    const [value, update] = useReducer(getValuesFromWindow, getValuesFromWindow());

    useLayoutEffect(() => {
        const handleScroll = throttle(update, 40);

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as WindowContextProvider
};
