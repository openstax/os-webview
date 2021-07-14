import React from 'react';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';

/*
    Load slug
    Create context value from loaded data
    Render children within context provider
*/

function ContextProvider({Context, data, useContextValue, children}) {
    return (
        <Context.Provider value={useContextValue(data)}>
            {children}
        </Context.Provider>
    );
}

export default function ContextLoader({Context, slug, useContextValue, children, ...loaderArgs}) {
    const Child = ({data}) => (
        <ContextProvider {...{Context, data, useContextValue, children}} />
    );

    return (
        <LoaderPage slug={slug} Child={Child} {...loaderArgs} />
    );
}
