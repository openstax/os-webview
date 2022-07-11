import {useReducer, useCallback} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue({maxSelections}) {
    const [data, dispatch] = useReducer((state, [action, item]) => {
        const itemsOtherThanItem = state.filter((i) => i !== item);
        const canAdd = !maxSelections || (itemsOtherThanItem.length < maxSelections);

        switch (action) {
        case 'add': return canAdd ? [...itemsOtherThanItem, item] : state;
        case 'remove': return itemsOtherThanItem;
        default: return state;
        }
    }, []);
    const select = useCallback((item) => dispatch(['add', item]), []);
    const deselect = useCallback((item) => dispatch(['remove', item]), []);
    const isSelected = useCallback((item) => data.includes(item), [data]);

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
