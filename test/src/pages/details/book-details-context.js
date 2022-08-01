import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import ShellContextProvider from '../../../helpers/shell-context';
import {DetailsContextProvider} from '~/pages/details/context';

export default function BookDetailsContextProvider({children}) {
    return (
        <ShellContextProvider>
            <MemoryRouter initialEntries={["/details/books/college-algebra"]}>
                <DetailsContextProvider>
                    {children}
                </DetailsContextProvider>
            </MemoryRouter>
        </ShellContextProvider>
    );
}
