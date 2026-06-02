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
import {NonPortalRouteWrapper} from './router-helpers/non-portal-route-wrapper';
import useSharedDataContext from '~/contexts/shared-data';
import useUserContext from '~/contexts/user';
import Chat from '~/components/chat/chat';
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

// eslint-disable-next-line complexity
function MainRoutes() {
    const {Layout} = useLayoutContext();
    const {pathname} = useLocation();
    const {flags} = useSharedDataContext();
    const {isLoggedIn} = useUserContext();

    // Determine if chat should be shown based on current route and feature flags
    // eslint-disable-next-line complexity
    const showChat = React.useMemo(() => {
        if (!flags) {
            return false;
        }

        // If chat_logged_in is enabled and user is logged in, show on any page
        if (flags.chat_logged_in && isLoggedIn) {
            return true;
        }

        // Check if we're on a book details page
        if (pathname.startsWith('/details/') && flags.chat_book_details) {
            return true;
        }

        // Check if we're on a subjects page
        if (pathname.startsWith('/subjects') && flags.chat_subjects) {
            return true;
        }

        // Check if we're on the contact page
        if (pathname.startsWith('/contact') && flags.chat_contact) {
            return true;
        }

        return false;
    }, [pathname, flags, isLoggedIn]);

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
                <Route path="/:dir/*" element={<OtherPageRoutes />} />
            </Routes>
            {showChat && <Chat />}
        </Layout>
    );
}
