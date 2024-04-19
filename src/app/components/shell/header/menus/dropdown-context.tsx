import buildContext from '~/components/jsx-helpers/build-context';
import {useState} from 'react';

function useContextValue({prefix} = {prefix: 'menulabel'}) {
    const [activeDropdown, setActiveDropdown] = useState({});
    const [submenuLabel, setSubmenuLabel] = useState();

    return {
        activeDropdown,
        setActiveDropdown,
        submenuLabel,
        setSubmenuLabel,
        prefix
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as DropdownContextProvider
};
