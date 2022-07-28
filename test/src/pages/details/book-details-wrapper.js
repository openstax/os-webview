import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {DetailsContextProvider} from '~/pages/details/context';
import {LanguageContextProvider} from '~/contexts/language';
import {UserContextProvider} from '~/contexts/user';

export default function BookDetailsWrapper({children}) {
    return (
        <MemoryRouter initialEntries={["/details/books/college-algebra"]}>
            <UserContextProvider>
                <LanguageContextProvider>
                    <DetailsContextProvider>
                        {children}
                    </DetailsContextProvider>
                </LanguageContextProvider>
            </UserContextProvider>
        </MemoryRouter>
    );
}
