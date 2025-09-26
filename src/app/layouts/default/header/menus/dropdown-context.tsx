import buildContext from '~/components/jsx-helpers/build-context';
import {useState} from 'react';

function useContextValue({prefix} = {prefix: 'menulabel'}) {
    const [activeDropdown, setActiveDropdown] = useState<
        React.MutableRefObject<HTMLAnchorElement | null> | Record<string, never>
    >({});
    const [submenuLabel, setSubmenuLabel] = useState<string>();

    return {
        activeDropdown,
        setActiveDropdown,
        submenuLabel,
        setSubmenuLabel,
        prefix
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as DropdownContextProvider};
