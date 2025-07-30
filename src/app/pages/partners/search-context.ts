import React from 'react';
import {useRefreshable} from '~/helpers/data';
import buildContext from '~/components/jsx-helpers/build-context';

type ActionMode = 'delete' | 'add';
type Action = {
    [mode in ActionMode]: unknown;
}

export type Store = {
    value: undefined | string | string[];
    toggle: (v: string) => void;
    includes: (item: string) => boolean;
}

function useSet<T=unknown>() {
    const {current: data} = React.useRef(new window.Set<T>());
    const [value, update] = useRefreshable(
        () => Array.from(data)
    );
    const [lastAction, setLastAction] = React.useReducer(
        (s:Action | undefined, a:Action) => JSON.stringify(s) === JSON.stringify(a) ? s : a,
        undefined
    );
    const toggle = React.useCallback(
        (item: T) => {
            const action = data.has(item) ? 'delete' : 'add';

            data[action](item);
            setLastAction({[action]: item} as Action);
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
        value: value as T[],
        toggle,
        clear,
        includes: data.has.bind(data),
        size: data.size,
        lastAction
    };
}

export type Scalar<T> = ReturnType<typeof useScalar<T>>;

function useScalar<T=unknown>(initialValue: T) {
    const [value, setValue] = React.useState<T>(initialValue);
    const [lastAction, setLastAction] = React.useState<Action>();
    const toggle = React.useCallback(
        (item: T) => {
            const action = item === value ? 'remove' : 'add';

            setValue(action === 'add' ? item : initialValue);
            setLastAction({[action]: item} as Action);
        },
        [value, initialValue]
    );
    const clear = React.useCallback(
        () => setValue(initialValue),
        [initialValue]
    );
    const includes = React.useCallback(
        (item: T) => item === value,
        [value]
    );

    return {
        value,
        toggle,
        clear,
        includes,
        size: value === initialValue ? 0 : 1,
        setValue,
        lastAction
    };
}

function useContextValue() {
    const books = useSet<string>();
    const types = useScalar<string | undefined>(undefined);
    const advanced = useSet<string>();
    const sort = useScalar<number>(0);
    const resultCount = useScalar<number>(0);
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
