import {useState, useLayoutEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import throttle from 'lodash/throttle';

function useContextValue() {
    const [value, setValue] = useState(window);

    useLayoutEffect(() => {
        const update = () => setValue({...window});
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
