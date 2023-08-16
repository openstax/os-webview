import React from 'react';

type ContextType = {
    flags: {[key: string]: boolean};
    stickyFooterState: ReturnType<typeof React.useState<boolean | null>>;
};
type ProviderArgs = React.PropsWithChildren<{
    contextValueParameters?: unknown;
}>;

declare const {
    useContext,
    ContextProvider
}: {
    useContext(): ContextType;
    ContextProvider({
        children,
        contextValueParameters
    }: ProviderArgs): React.JSX.Element | null;
};

export {useContext as default, ContextProvider as SharedDataContextProvider};
