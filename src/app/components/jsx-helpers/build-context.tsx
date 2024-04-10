import React from 'react';

export default function buildContext<P, V>({
    defaultValue = {} as V,
    useContextValue
}: {
    defaultValue?: V;
    useContextValue: (p: P) => V;
}) {
    const Context = React.createContext(defaultValue);

    function useContext() {
        return React.useContext(Context);
    }

    function ContextProvider({
        children,
        contextValueParameters = undefined as P
    }: React.PropsWithChildren<{
        contextValueParameters?: P;
    }>) {
        const value = useContextValue(contextValueParameters);

        if (value === undefined) {
            return null;
        }

        return <Context.Provider value={value}>{children}</Context.Provider>;
    }

    return {useContext, ContextProvider};
}
