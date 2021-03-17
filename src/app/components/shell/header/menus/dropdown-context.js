import React, {useState} from 'react';

export const DropdownContext = React.createContext();

export function DropdownContextProvider({children}) {
    const [activeDropdown, setActiveDropdown] = useState({});
    const [submenuLabel, setSubmenuLabel] = useState();
    const value = {
        activeDropdown,
        setActiveDropdown,
        submenuLabel,
        setSubmenuLabel
    };

    return (
        <DropdownContext.Provider value={value}>
            {children}
        </DropdownContext.Provider>
    );
}
