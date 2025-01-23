import {useReducer, useLayoutEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import throttle from 'lodash/throttle';

function useContextValue() {
    const [value, refresh] = useReducer(() => ({...window}), window);

    useLayoutEffect(() => {
        const handleScroll = throttle(refresh, 40);

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

export {useContext as default, ContextProvider as WindowContextProvider};
