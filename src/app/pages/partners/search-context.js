import React from 'react';
import {useRefreshable} from '~/helpers/data';
import buildContext from '~/components/jsx-helpers/build-context';

function useSet() {
    const {current: data} = React.useRef(new window.Set());
    const [value, update] = useRefreshable(
        () => Array.from(data)
    );
    const [lastAction, setLastAction] = React.useReducer(
        (s, a) => JSON.stringify(s) === JSON.stringify(a) ? s : a
    );
    const toggle = React.useCallback(
        (item) => {
            const action = data.has(item) ? 'delete' : 'add';

            data[action](item);
            setLastAction({[action]: item});
            update();
        },
        [data, update]
    );
    const clear = React.useCallback(
        () => {
            data.clear();
            update();
        },
        [data, update]
    );

    return {
        value,
        toggle,
        clear,
        includes: data.has.bind(data),
        size: data.size,
        lastAction
    };
}

function useScalar(initialValue) {
    const [value, setValue] = React.useState(initialValue);
    const [lastAction, setLastAction] = React.useState();
    const toggle = React.useCallback(
        (item) => {
            const action = item === value ? 'remove' : 'add';

            setValue(action === 'add' ? item : null);
            setLastAction({[action]: item});
        },
        [value]
    );
    const clear = React.useCallback(
        () => setValue(null),
        []
    );
    const includes = React.useCallback(
        (item) => item === value,
        [value]
    );

    return {
        value,
        toggle,
        clear,
        includes,
        size: value === null ? 0 : 1,
        setValue,
        lastAction
    };
}

function useContextValue() {
    const books = useSet();
    const types = useScalar();
    const advanced = useSet();
    const sort = useScalar('-2');
    const resultCount = useScalar('0');
    const clearStores = React.useCallback(
        () => {
            for (const store of [books, types, advanced]) {
                store.clear();
            }
        },
        [books, types, advanced]
    );

    return {
        books,
        types,
        advanced,
        sort,
        resultCount,
        clearStores
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SearchContextProvider
};
