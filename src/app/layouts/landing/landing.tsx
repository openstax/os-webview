import React from 'react';
import Header from './header/header';
import {SalesforceContextProvider} from '~/contexts/salesforce';
import useMainClassContext, {
    MainClassContextProvider
} from '~/contexts/main-class';
import useLanguageContext from '~/contexts/language';
import ReactModal from 'react-modal';
import cn from 'classnames';
import { LinkFields } from '../../pages/flex-page/components/Link';
import './landing.scss';
import JITLoad from '~/helpers/jit-load';

type Props = {
    data: {
        title: string;
        meta?: {
            type: string;
        },
        layout: Array<{
            value: {
                navLinks: LinkFields[];
            }
        }>
    }
}

function Footer({data: {meta}}: Props) {
    const type = meta?.type;
    const isFlex = type === 'pages.FlexPage' || type === 'pages.RootPage';
    const importFn = isFlex
        ? () => import('~/layouts/landing/footer/flex')
        : () => import('~/layouts/default/footer/footer');

    return <JITLoad importFn={importFn} />;
}

export default function LandingLayout({children, data}: React.PropsWithChildren<Props>) {
    // BrowserRouter has to include everything that uses useLocation

    return (
        <React.Fragment>
            <header className="landing-page-header">
                <Header links={data.layout[0]?.value.navLinks ?? []} />
            </header>
            <SalesforceContextProvider>
                <MainClassContextProvider>
                    <Main data={data}>{children}</Main>
                </MainClassContextProvider>
            </SalesforceContextProvider>
            <footer id="footer">
                <Footer data={data} />
            </footer>
        </React.Fragment>
    );
}

function Main({children, data}: React.PropsWithChildren<Props>) {
    const {language} = useLanguageContext();
    const ref = React.useRef<HTMLDivElement>(null);
    const {classes} = useMainClassContext();

    React.useEffect(() => {
        ReactModal.setAppElement(ref.current as HTMLDivElement);
    }, []);

    return (
        <div
            id="main"
            className={cn('lang', 'layout-landing', language, classes)}
            data-analytics-nav={`Landing page (${data.title})`}
            ref={ref}
            tabIndex={-1}
        >
            {children}
        </div>
    );
}
