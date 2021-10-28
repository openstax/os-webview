import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue({onValueUpdate}) {
    const [item, setItem] = useState();

    useEffect(() => onValueUpdate && onValueUpdate(item?.value), [item, onValueUpdate]);

    return {
        select: setItem,
        clear: () => setItem(),
        item
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SelectContextProvider
};
