import {useReducer, useCallback, useEffect, useRef} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

// When you need to look at data but don't need to react to changes
// The ref is your dependency instead of the data
function useDataRef(data) {
    const ref = useRef(data);

    useEffect(
        () => {ref.current = data;},
        [data]
    );

    return ref;
}

function useContextValue() {
    const [data, dispatch] = useReducer((state, [action, item]) => {
        switch (action) {
        case 'add': return [...state, item];
        case 'remove': return state.filter((i) => i !== item);
        default: return state;
        }
    }, []);
    const selectedItemsRef = useDataRef(data);
    const select = useCallback((item) => dispatch(['add', item]), []);
    const deselect = useCallback((item) => dispatch(['remove', item]), []);
    const isSelected = useCallback((item) => selectedItemsRef.current.includes(item), [selectedItemsRef]);

    return {
        select,
        deselect,
        isSelected,
        selectedItems: data
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as MultiselectContextProvider
};
