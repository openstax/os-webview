import React, {Suspense} from 'react';
import useLanguageContext, {LanguageContextProvider} from '~/contexts/language';
import {SubjectCategoryContextProvider} from '~/contexts/subject-category';
import {UserContextProvider} from '~/contexts/user';
import {SalesforceContextProvider} from '~/contexts/salesforce';
import {BrowserRouter} from 'react-router-dom';
import Router from './router';
import retry from '~/helpers/retry';
import ReactModal from 'react-modal';
import {FlagContextProvider} from './flag-context';
import Welcome from './welcome/welcome';
import TakeoverDialog from './takeover-dialog/takeover-dialog';
import bus from './shell-bus';
import cn from 'classnames';

let stickyCount = 0;

function setUpBus(mainEl) {
    bus.on('with-sticky', () => {
        ++stickyCount;
        mainEl.classList.add('with-sticky');
    });

    bus.on('no-sticky', () => {
        --stickyCount;
        if (stickyCount <= 0) {
            mainEl.classList.remove('with-sticky');
        }
    });
    bus.on('with-modal', () => {
        mainEl.classList.add('with-modal');
        document.body.classList.add('no-scroll');
    });
    bus.on('no-modal', () => {
        mainEl.classList.remove('with-modal');
        document.body.classList.remove('no-scroll');
    });
}

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

    React.useEffect(() => {
        setUpBus(ref.current);
        ReactModal.setAppElement(ref.current);
    }, []);

    return (
        <div id="main" className={cn('lang', language)} ref={ref}>
            <Welcome />
            <TakeoverDialog />
            <Router />
        </div>
    );
}

function App() {
    // BrowserRouter has to include everything that uses useLocation
    return (
        <FlagContextProvider>
            <UserContextProvider>
                <LanguageContextProvider>
                    <SubjectCategoryContextProvider>
                        <BrowserRouter>
                            <div id="microsurvey">
                                <Microsurvey />
                            </div>
                            <header id="header">
                                <Header />
                            </header>
                            <div id="lower-sticky-note">
                                <LowerStickyNote />
                            </div>
                            <SalesforceContextProvider>
                                <Main />
                            </SalesforceContextProvider>
                            <footer id="footer">
                                <Footer />
                            </footer>
                        </BrowserRouter>
                    </SubjectCategoryContextProvider>
                </LanguageContextProvider>
            </UserContextProvider>
        </FlagContextProvider>
    );
}

export default React.createElement(App);
