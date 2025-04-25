import React from 'react';
import {LanguageContextProvider} from '~/contexts/language';
import {SubjectCategoryContextProvider} from '~/contexts/subject-category';
import {UserContextProvider} from '~/contexts/user';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {SharedDataContextProvider} from '../../contexts/shared-data';
import JITLoad from '~/helpers/jit-load';
import {SalesforceContextProvider} from '~/contexts/salesforce';
import {PortalContextProvider} from '~/contexts/portal';

import Error404 from '~/pages/404/404';

function AppContext({children}: React.PropsWithChildren<object>) {
    return (
        <SharedDataContextProvider>
            <UserContextProvider>
                <LanguageContextProvider>
                    <PortalContextProvider>
                        <SubjectCategoryContextProvider>
                            {children}
                        </SubjectCategoryContextProvider>
                    </PortalContextProvider>
                </LanguageContextProvider>
            </UserContextProvider>
        </SharedDataContextProvider>
    );
}

const importContact = () => import('~/pages/contact/embedded.js');

function EmbeddedApp() {
    return (
        <SalesforceContextProvider>
            <Routes>
                <Route path="contact" element={<JITLoad importFn={importContact} />} />
                <Route path="*" element={<Error404 />} />
            </Routes>
        </SalesforceContextProvider>
    );
}

const importRouter = () => import('./import-router.js');

function App() {
    return (
        <AppContext>
            <BrowserRouter>
                <Routes>
                    <Route path="/embedded/*" element={<EmbeddedApp />} />
                    <Route path="*" element={<JITLoad importFn={importRouter} />} />
                </Routes>
            </BrowserRouter>
        </AppContext>
    );
}

export default React.createElement(App);
