import {useReducer, useCallback} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue<T extends {value: string; text: string}>({maxSelections}: {maxSelections: number}) {
    const [data, dispatch] = useReducer((state: T[], [action, item]: [string, T]) => {
        const itemsOtherThanItem = state.filter((i) => i !== item);
        const canAdd = !maxSelections || (itemsOtherThanItem.length < maxSelections);

        switch (action) {
        case 'add': return canAdd ? [...itemsOtherThanItem, item] : state;
        case 'remove': return itemsOtherThanItem;
        default: return state;
        }
    }, []);
    const select = useCallback((item: T) => dispatch(['add', item]), []);
    const deselect = useCallback((item: T) => dispatch(['remove', item]), []);
    const isSelected = useCallback((item: T) => data.includes(item), [data]);

    return {
        select,
        deselect,
        isSelected,
        selectedItems: data
    };
}

const {useContext, ContextProvider} =
    buildContext<{maxSelections: number}, ReturnType<typeof useContextValue>>({useContextValue});

export {
    useContext as default,
    ContextProvider as MultiselectContextProvider
};
