import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import ShellContextProvider from '../../../helpers/shell-context';
import {DetailsContextProvider} from '~/pages/details/context';
import {MemoryRouter} from 'react-router-dom';

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
        <MemoryRouter initialEntries={[slug]}>
            <LoaderPage slug={slug} Child={BookDetailsWithContext} doDocumentSetup props={{children}} />
        </MemoryRouter>
    );
}
