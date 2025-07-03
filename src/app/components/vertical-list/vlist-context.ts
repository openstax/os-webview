import {useState} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue() {
    const [count, setCount] = useState(0);
    const [index, setIndex] = useState(-1);

    return {
        count,
        setCount,
        index,
        setIndex
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as VListContextProvider
};
