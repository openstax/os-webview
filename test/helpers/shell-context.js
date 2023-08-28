import React from 'react';
import {LanguageContextProvider} from '~/contexts/language';
import {SubjectCategoryContextProvider} from '~/contexts/subject-category';
import {UserContextProvider} from '~/contexts/user';
import {SharedDataContextProvider} from '~/contexts/shared-data';

export default function ShellContextProvider({children}) {
    return (
        <SharedDataContextProvider>
            <UserContextProvider>
                <LanguageContextProvider>
                    <SubjectCategoryContextProvider>
                        {children}
                    </SubjectCategoryContextProvider>
                </LanguageContextProvider>
            </UserContextProvider>
        </SharedDataContextProvider>
    );
}
