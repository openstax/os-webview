import React, {Suspense} from 'react';
import useLanguageContext, {LanguageContextProvider} from '~/contexts/language';
import {SubjectCategoryContextProvider} from '~/contexts/subject-category';
import {UserContextProvider} from '~/contexts/user';
import {SalesforceContextProvider} from '~/contexts/salesforce';
import useMainClassContext, {MainClassContextProvider} from '~/contexts/main-class';
import {BrowserRouter} from 'react-router-dom';
import Router from './router';
import retry from '~/helpers/retry';
import ReactModal from 'react-modal';
import {SharedDataContextProvider} from '../../contexts/shared-data';
import Welcome from './welcome/welcome';
import TakeoverDialog from './takeover-dialog/takeover-dialog';
import cn from 'classnames';

function ImportedComponent({name}) {
    const Component = React.useMemo(
        () => React.lazy(() => retry(() => import(`./${name}/${name}`))),
        [name]
    );

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Component />
        </Suspense>
    );
}

const Microsurvey = () => <ImportedComponent name="microsurvey-popup" />;
const Header = () => <ImportedComponent name="header" />;
const LowerStickyNote = () => <ImportedComponent name="lower-sticky-note" />;
const Footer = () => <ImportedComponent name="footer" />;

function Main() {
    const {language} = useLanguageContext();
    const ref = React.useRef();
    const {classes} = useMainClassContext();

    React.useEffect(() => {
        ReactModal.setAppElement(ref.current);
    }, []);

    return (
        <div id="main" className={cn('lang', language, classes)} ref={ref}>
            <Welcome />
            <TakeoverDialog />
            <Router />
        </div>
    );
}

function App() {
    // BrowserRouter has to include everything that uses useLocation
    return (
        <SharedDataContextProvider>
            <UserContextProvider>
                <LanguageContextProvider>
                    <SubjectCategoryContextProvider>
                        <BrowserRouter>
                            <Microsurvey />
                            <header id="header">
                                <Header />
                            </header>
                            <div id="lower-sticky-note">
                                <LowerStickyNote />
                            </div>
                            <SalesforceContextProvider>
                                <MainClassContextProvider>
                                    <Main />
                                </MainClassContextProvider>
                            </SalesforceContextProvider>
                            <footer id="footer">
                                <Footer />
                            </footer>
                        </BrowserRouter>
                    </SubjectCategoryContextProvider>
                </LanguageContextProvider>
            </UserContextProvider>
        </SharedDataContextProvider>
    );
}

export default React.createElement(App);
