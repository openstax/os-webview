import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue({prefix} = {prefix: 'menulabel'}) {
    const [activeDropdown, setActiveDropdown] = React.useState({});
    const [submenuLabel, setSubmenuLabel] = React.useState();

    return {
        activeDropdown,
        setActiveDropdown,
        submenuLabel,
        setSubmenuLabel,
        prefix
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

type Arg = {
    prefix: string;
};
type DDCPArgs = React.PropsWithChildren<{
    contextValueParameters?: Arg;
}>;
const DropdownContextProvider = ContextProvider as (
    args: DDCPArgs
) => JSX.Element;

export {useContext as default, DropdownContextProvider};
