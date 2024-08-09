import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import ShellContextProvider from '../../../helpers/shell-context';
import {DetailsContextProvider} from '~/pages/details/context';
import {MemoryRouter} from 'react-router-dom';

// Tamp down meaningless errors
jest.mock('~/models/rex-release', () => jest.fn().mockReturnValue(Promise.resolve({
    webviewRexLink: '',
    contents: []
})));
jest.mock('~/models/give-today', () => jest.fn().mockReturnValue({}));
jest.mock('~/models/table-of-contents-html', () => jest.fn().mockReturnValue(Promise.resolve({})));

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
    const absoluteSlug = slug.startsWith('/') ? slug : `/${slug}`;

    return (
        <MemoryRouter initialEntries={[absoluteSlug]}>
            <LoaderPage slug={slug} Child={BookDetailsWithContext} doDocumentSetup props={{children}} />
        </MemoryRouter>
    );
}
