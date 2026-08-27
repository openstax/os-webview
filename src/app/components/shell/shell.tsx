import React from 'react';
import {LanguageContextProvider} from '~/contexts/language';
import {SubjectCategoryContextProvider} from '~/contexts/subject-category';
import {UserContextProvider} from '~/contexts/user';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {SharedDataContextProvider} from '../../contexts/shared-data';
import JITLoad, {DelayedFallback} from '~/helpers/jit-load';
import {SalesforceContextProvider} from '~/contexts/salesforce';
import {PortalContextProvider} from '~/contexts/portal';
import HeadlessUserbar from '~/components/headless-userbar/headless-userbar';
import Header from '~/layouts/default/header/header';

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

// Keeps the real nav bar on screen for a hard load instead of the bare
// logo JITLoad would otherwise show while the router chunk downloads.
// A component (rather than an element built once at module scope) so
// Header is looked up when React actually renders the fallback.
function RouterFallback() {
    return (
        <React.Fragment>
            <header id="header">
                <Header />
            </header>
            <DelayedFallback fullPage />
        </React.Fragment>
    );
}

function App() {
    return (
        <AppContext>
            <HeadlessUserbar />
            <BrowserRouter>
                <Routes>
                    <Route path="/embedded/*" element={<EmbeddedApp />} />
                    <Route
                        path="*"
                        element={<JITLoad importFn={importRouter} fallback={<RouterFallback />} />}
                    />
                </Routes>
            </BrowserRouter>
        </AppContext>
    );
}

export default React.createElement(App);
