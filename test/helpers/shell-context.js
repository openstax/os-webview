import React from 'react';
import {LanguageContextProvider} from '~/contexts/language';
import {SubjectCategoryContextProvider} from '~/contexts/subject-category';
import {UserContextProvider} from '~/contexts/user';
import {FlagContextProvider} from '~/components/shell/flag-context';

export default function ShellContextProvider({children}) {
    return (
        <FlagContextProvider>
            <UserContextProvider>
                <LanguageContextProvider>
                    <SubjectCategoryContextProvider>
                        {children}
                    </SubjectCategoryContextProvider>
                </LanguageContextProvider>
            </UserContextProvider>
        </FlagContextProvider>
    );
}
