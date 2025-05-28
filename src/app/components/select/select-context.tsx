import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

export type SelectItem = {
    value: string;
    label: string;
    selected?: boolean;
};

function useContextValue({
    onValueUpdate
}: {
    onValueUpdate?: (v: string) => void;
}) {
    const [item, setItem] = useState<SelectItem>();

    useEffect(() => item && onValueUpdate?.(item.value), [item, onValueUpdate]);

    return {
        select: setItem,
        item
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as SelectContextProvider};
