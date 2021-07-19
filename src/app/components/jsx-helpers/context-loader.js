import React from 'react';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';

export default function buildContextLoader() {
    const Context = React.createContext();

    function useContext() {
        return React.useContext(Context);
    }

    function ContextLoader({slug, useContextValue, children, ...loaderArgs}) {
        const Child = ({data}) => (
            <Context.Provider value={useContextValue(data)} children={children} />
        );

        return (
            <LoaderPage slug={slug} Child={Child} {...loaderArgs} />
        );
    }

    return {
        useContext,
        ContextLoader
    };
}
