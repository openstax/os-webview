import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import ShellContextProvider from '../../../helpers/shell-context';
import {DetailsContextProvider} from '~/pages/details/context';

function BookDetailsWithContext({data, children}) {
    return (
        <ShellContextProvider>
            <DetailsContextProvider contextValueParameters={{data}}>
                {children}
            </DetailsContextProvider>
        </ShellContextProvider>
    );
}

export default function BookDetailsLoader({slug, children}) {
    return (
        <LoaderPage slug={slug} Child={BookDetailsWithContext} doDocumentSetup props={{children}} />
    );
}
