import React from 'react';

const NavigationContext = React.createContext({});

export function NavigationContextProvider({children, targetIds}) {
    const initialId = window.location.hash.substr(1) || targetIds[0];
    const [activeId, setActiveId] = React.useState(initialId);
    const value = {
        activeId,
        setActiveId,
        targetIds
    };

    return (
        <NavigationContext.Provider value={value} children={children} />
    );
}

export default NavigationContext;
