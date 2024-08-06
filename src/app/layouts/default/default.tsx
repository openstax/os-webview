import React from 'react';
import {SalesforceContextProvider} from '~/contexts/salesforce';
import useMainClassContext, {
    MainClassContextProvider
} from '~/contexts/main-class';
import useLanguageContext from '~/contexts/language';
import ReactModal from 'react-modal';
import Welcome from './welcome/welcome';
import TakeoverDialog from './takeover-dialog/takeover-dialog';
import cn from 'classnames';
import './default.scss';

export default function DefaultLayout({children}: React.PropsWithChildren<object>) {
    // BrowserRouter has to include everything that uses useLocation
    return (
        <SalesforceContextProvider>
            <MainClassContextProvider>
                <Main>{children}</Main>
            </MainClassContextProvider>
        </SalesforceContextProvider>
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
            <Welcome />
            <TakeoverDialog />
            {children}
        </div>
    );
}
