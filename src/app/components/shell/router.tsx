import React, {useEffect} from 'react';
import {Routes, Route, useLocation} from 'react-router-dom';
import $ from '~/helpers/$';
import {PageTitleConfirmation} from './announce-page-title';
import {assertNotNull, assertDefined} from '~/helpers/data';
import useLinkHandler from './router-helpers/use-link-handler';
import {RouterContextProvider} from './router-context';
import useLayoutContext, {LayoutContextProvider} from '~/contexts/layout';
import usePortalContext from '~/contexts/portal';
import {initializeGTM} from '~/helpers/tag-manager';
import {
    HomePage,
    ErrataRoutes,
    DetailsRoutes,
    OtherPageRoutes,
    generateFooterPageRoutes
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
    const {isK12Portal} = usePortalContext();

    useEffect(() => {
        document.addEventListener('click', linkHandler);

        return () => document.removeEventListener('click', linkHandler);
    }, [linkHandler]);

    useEffect(() => {
        if ('piTracker' in window && window.piTracker instanceof Function) {
            window.piTracker(canonicalUrl);
        }
    }, [canonicalUrl]);

    // Initialize GTM only when isK12Portal is explicitly false
    // isK12Portal starts as true (GTM disabled), then routing logic sets it to false when safe
    useEffect(() => {
        if (isK12Portal === false) {
            initializeGTM();
        }
    }, [isK12Portal]);

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

// Wrapper component that enables GTM for all non-portal top-level routes
// Portal routes handle their own GTM enablement via RouteAsPortalOrNot
function NonPortalRouteWrapper({children}: {children: React.ReactNode}) {
    const {setIsK12Portal} = usePortalContext();

    useEffect(() => {
        // These are all non-portal routes, so enable GTM
        setIsK12Portal(false);
    }, [setIsK12Portal]);

    return <>{children}</>;
}

function MainRoutes() {
    const {Layout} = useLayoutContext();

    return (
        <Layout>
            <Routes>
                <Route index element={<NonPortalRouteWrapper><HomePage /></NonPortalRouteWrapper>} />
                {generateFooterPageRoutes().map((route) =>
                    React.cloneElement(route, {
                        element: <NonPortalRouteWrapper>{route.props.element}</NonPortalRouteWrapper>
                    })
                )}
                <Route path="/errata/*" element={<NonPortalRouteWrapper><ErrataRoutes /></NonPortalRouteWrapper>} />
                <Route path="/details/*" element={<NonPortalRouteWrapper><DetailsRoutes /></NonPortalRouteWrapper>} />
                <Route path="/:dir/*" element={<NonPortalRouteWrapper><OtherPageRoutes /></NonPortalRouteWrapper>} />
            </Routes>
        </Layout>
    );
}
