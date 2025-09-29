import React from 'react';
import Microsurvey from './microsurvey-popup/microsurvey-popup';
import Header from './header/header';
import LowerStickyNote from './lower-sticky-note/lower-sticky-note';
import Footer from './footer/footer';
import {SalesforceContextProvider} from '~/contexts/salesforce';
import useMainClassContext, {
    MainClassContextProvider
} from '~/contexts/main-class';
import useLanguageContext from '~/contexts/language';
import ReactModal from 'react-modal';
import TakeoverDialog from './takeover-dialog/takeover-dialog';
import cn from 'classnames';
import './default.scss';

export default function DefaultLayout({children}: React.PropsWithChildren<object>) {
    // BrowserRouter has to include everything that uses useLocation
    return (
        <React.Fragment>
            <Microsurvey />
            <header id="header">
                <Header />
            </header>
            <div id="lower-sticky-note">
                <LowerStickyNote />
            </div>
            <SalesforceContextProvider>
                <MainClassContextProvider>
                    <Main>{children}</Main>
                </MainClassContextProvider>
            </SalesforceContextProvider>
            <footer id="footer">
                <Footer />
            </footer>
        </React.Fragment>
    );
}

function Main({children}: React.PropsWithChildren<object>) {
    const {language} = useLanguageContext();
    const ref = React.useRef<HTMLDivElement>(null);
    const {classes} = useMainClassContext();

    React.useEffect(() => {
        ReactModal.setAppElement(ref.current as HTMLDivElement);
    }, []);

    return (
        <div
            id="main"
            className={cn('lang', 'layout-default', language, classes)}
            ref={ref}
            tabIndex={-1}
        >
            <TakeoverDialog />
            {children}
        </div>
    );
}
