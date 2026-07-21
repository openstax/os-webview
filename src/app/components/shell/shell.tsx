import React from 'react';
import {LanguageContextProvider} from '~/contexts/language';
import {SubjectCategoryContextProvider} from '~/contexts/subject-category';
import useUserContext, {UserContextProvider, UserStatus} from '~/contexts/user';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {SharedDataContextProvider} from '../../contexts/shared-data';
import JITLoad from '~/helpers/jit-load';
import {SalesforceContextProvider} from '~/contexts/salesforce';
import {PortalContextProvider} from '~/contexts/portal';
import HeadlessUserbar from '~/components/headless-userbar/headless-userbar';
import {identifyUser, resetUser} from '~/helpers/posthog';

import Error404 from '~/pages/404/404';

function identifyProps(userStatus: UserStatus | undefined) {
    return {
        isInstructor: Boolean(userStatus?.isInstructor),
        isStudent: Boolean(userStatus?.isStudent),
        school: userStatus?.school
    };
}

/** PostHog is loaded by GTM, so there's no SDK to init here — just tell it
 *  who's logged in once the user model resolves, and clear on logout. */
function PostHogUserIdentifier() {
    const {uuid, userStatus} = useUserContext();
    const prevUuidRef = React.useRef<string | undefined>(undefined);

    React.useEffect(() => {
        const prevUuid = prevUuidRef.current;

        prevUuidRef.current = uuid;
        if (uuid && uuid !== prevUuid) {
            identifyUser(uuid, identifyProps(userStatus));
        } else if (!uuid && prevUuid) {
            resetUser();
        }
    }, [uuid, userStatus]);

    return null;
}

function AppContext({children}: React.PropsWithChildren<object>) {
    return (
        <SharedDataContextProvider>
            <UserContextProvider>
                <PostHogUserIdentifier />
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
            <HeadlessUserbar />
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
