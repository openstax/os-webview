import React from 'react';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';

const Context = React.createContext();

export default Context;

export function useTocState() {
    const [tocActive, toggleTocActive] = useToggle(false);

    return {
        isOpen: tocActive,
        toggle: toggleTocActive
    };
}
