import React, {useEffect} from 'react';
import {Routes, Route, useLocation} from 'react-router-dom';
import $ from '~/helpers/$';
import {PageTitleConfirmation} from './announce-page-title';
import {assertNotNull, assertDefined} from '~/helpers/data';
import useLinkHandler from './router-helpers/use-link-handler';
import {RouterContextProvider} from './router-context';
import useLayoutContext, {LayoutContextProvider} from '~/contexts/layout';
import {ImportedPage} from './router-helpers/page-loaders';
import {
    HomePage,
    ErrataRoutes,
    DetailsRoutes,
    OtherPageRoutes
} from './router-helpers/page-routes';
import './skip-to-content.scss';

function doSkipToContent(event: React.MouseEvent) {
    event.preventDefault();
    const mainEl = document.getElementById('main');
    const target = assertDefined(
        assertNotNull(mainEl?.querySelector($.focusable))
    ) as HTMLElement;

    $.scrollTo(target);
    target.focus();
}

function SkipToContent() {
    return (
        <a className="skiptocontent" href="#main" onClick={doSkipToContent}>
            skip to main content
        </a>
    );
}

export default function Router() {
    const linkHandler = useLinkHandler() as unknown as (ev: MouseEvent) => void;
    const {origin} = window.location; // React-Router Location does not have origin
    const {pathname} = useLocation();
    const canonicalUrl = `${origin}${pathname}`;

    useEffect(() => {
        document.addEventListener('click', linkHandler);

        return () => document.removeEventListener('click', linkHandler);
    }, [linkHandler]);

    useEffect(() => {
        if ('piTracker' in window && window.piTracker instanceof Function) {
            window.piTracker(canonicalUrl);
        }
    }, [canonicalUrl]);

    return (
        <RouterContextProvider>
            <PageTitleConfirmation />
            <SkipToContent />
            <LayoutContextProvider>
                <MainRoutes />
            </LayoutContextProvider>
        </RouterContextProvider>
    );
}

const FOOTER_PAGES = [
    'license',
    'tos',
    'privacy',
    'privacy-policy',
    'accessibility-statement',
    'careers'
].map((s) => `/${s}/`);

function MainRoutes() {
    const {Layout} = useLayoutContext();

    return (
        <Layout>
            <Routes>
                <Route index element={<HomePage />} />
                {FOOTER_PAGES.map((path) => (
                    <Route
                        path={path}
                        key={path}
                        element={<ImportedPage name="footer-page" />}
                    />
                ))}
                <Route path="/errata/*" element={<ErrataRoutes />} />
                <Route path="/details/*" element={<DetailsRoutes />} />
                <Route path="/:dir/*" element={<OtherPageRoutes />} />
            </Routes>
        </Layout>
    );
}
