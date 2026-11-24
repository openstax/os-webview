import React from 'react';
import {LanguageContextProvider} from '~/contexts/language';
import {SubjectCategoryContextProvider} from '~/contexts/subject-category';
import {UserContextProvider} from '~/contexts/user';
import {PersonalizationContextProvider} from '~/contexts/personalization';
import {SharedDataContextProvider} from '~/contexts/shared-data';
import {PortalContextProvider} from '~/contexts/portal';

export default function ShellContextProvider({children}) {
    return (
        <SharedDataContextProvider>
            <UserContextProvider>
                <PersonalizationContextProvider>
                    <LanguageContextProvider>
                        <PortalContextProvider>
                            <SubjectCategoryContextProvider>
                                {children}
                            </SubjectCategoryContextProvider>
                        </PortalContextProvider>
                    </LanguageContextProvider>
                </PersonalizationContextProvider>
            </UserContextProvider>
        </SharedDataContextProvider>
    );
}
