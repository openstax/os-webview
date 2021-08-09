import buildContext from '~/components/jsx-helpers/build-context';
import {useState} from 'react';

function useContextValue() {
    const [activeDropdown, setActiveDropdown] = useState({});
    const [submenuLabel, setSubmenuLabel] = useState();

    return {
        activeDropdown,
        setActiveDropdown,
        submenuLabel,
        setSubmenuLabel
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as DropdownContextProvider
};
