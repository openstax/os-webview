import {useReducer} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue() {
    const [data, dispatch] = useReducer((state, [action, item]) => {
        switch (action) {
        case 'add': return [...state, item];
        case 'remove': return state.filter((i) => i !== item);
        default: return state;
        }
    }, []);

    return {
        select(item) {
            dispatch(['add', item]);
        },
        deselect(item) {
            dispatch(['remove', item]);
        },
        isSelected(item) {return data.includes(item);},
        selectedItems: data
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as MultiselectContextProvider
};
