import React from 'react';

export default function buildContext({
    defaultValue={},
    useContextValue
}) {
    const Context = React.createContext(defaultValue);

    function useContext() {
        return React.useContext(Context);
    }

    function ContextProvider({children, contextValueParameters=undefined}) {
        const value = useContextValue(contextValueParameters);

        if (value === undefined) {
            return null;
        }

        return (
            <Context.Provider value={value}>
                {children}
            </Context.Provider>
        );
    }

    return {useContext, ContextProvider};
}
