import React, {useEffect} from 'react';
import {Routes, Route, useLocation} from 'react-router-dom';
import $ from '~/helpers/$';
import {PageTitleConfirmation} from './announce-page-title';
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

// Long enough for a layout chunk to arrive on a slow connection, short enough
// that we never pull focus back from someone who gave up and tabbed onward.
const MAIN_WAIT_MS = 2000;

// The skip link targets the main region itself rather than the first focusable
// thing inside it: #main carries tabIndex={-1} in every layout, and landing on
// a descendant would silently skip whatever content sits above it. Returns the
// element focus ended up on, or null -- focus() is a no-op on an element that
// isn't focusable, so the caller has to be told which it got rather than
// assuming the move took.
function focusMain() {
    const mainEl = document.getElementById('main');

    if (!mainEl) {
        return null;
    }

    $.scrollTo(mainEl);
    mainEl.focus({preventScroll: true});

    return document.activeElement === mainEl ? mainEl : null;
}

// Focus is still ours while it sits on the link, on the element we moved it to,
// or back on the body because that element was just swapped out. Anything else
// is the user having moved on, and we leave them where they are.
function userMovedOn(link: HTMLElement, focused: HTMLElement | null) {
    const active = document.activeElement;

    return active !== link && active !== focused && active !== document.body;
}

// A layout is what renders #main, so at the moment a keyboard user reaches the
// link the region may be missing entirely, or may be one of the stand-ins the
// null layout and ChromeFallback render until a chunk resolves -- and a
// stand-in takes the focus with it when it goes. Either way the answer is to
// watch the DOM: the state that renders and replaces #main lives below this
// component, so an effect here would never re-run at the right time.
function useSkipToContent() {
    const stopWaitingRef = React.useRef<(() => void) | undefined>(undefined);

    useEffect(() => () => stopWaitingRef.current?.(), []);

    const waitForMain = React.useCallback(
        (link: HTMLElement, initiallyFocused: HTMLElement | null) => {
            stopWaitingRef.current?.();

            let focused = initiallyFocused;
            const observer = new MutationObserver(() => {
                if (userMovedOn(link, focused)) {
                    stopWaitingRef.current?.();
                    return;
                }
                // What we focused is still on the page, so there is nothing to
                // do yet; keep watching in case it gets replaced later.
                if (focused?.isConnected) {
                    return;
                }
                focused = focusMain();
            });
            const timer = window.setTimeout(
                () => stopWaitingRef.current?.(),
                MAIN_WAIT_MS
            );

            stopWaitingRef.current = () => {
                observer.disconnect();
                window.clearTimeout(timer);
                stopWaitingRef.current = undefined;
            };
            observer.observe(document.body, {childList: true, subtree: true});
        },
        []
    );

    return React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            const focused = focusMain();

            if (focused) {
                event.preventDefault();
            } else {
                // Nothing to focus yet, so the browser's own href="#main"
                // handling is the floor. Keep the click away from the
                // document-level link handler, which would preventDefault it
                // and route it through the router instead -- a navigation that
                // moves no focus at all.
                event.stopPropagation();
            }
            // Whatever we just focused may be a stand-in that a resolving
            // chunk is about to replace, so keep watching either way.
            waitForMain(event.currentTarget, focused);
        },
        [waitForMain]
    );
}

function SkipToContent() {
    const onClick = useSkipToContent();

    return (
        <a className="skiptocontent" href="#main" onClick={onClick}>
            skip to main content
        </a>
    );
}

export default function Router() {
    const linkHandler = useLinkHandler() as unknown as (ev: MouseEvent) => void;
    const {origin} = window.location; // React-Router Location does not have origin
    const {pathname, hash, search} = useLocation();
    const trackedUrl = `${origin}${pathname}${search}`;
    const {isK12Portal} = usePortalContext();

    // Browsers keep the scroll offset across a pushState navigation, so without
    // this a new page opens wherever the last one was scrolled to. Skip it when
    // there is a hash; that navigation is a request to scroll somewhere else.
    useEffect(() => {
        if (!hash) {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);

    useEffect(() => {
        document.addEventListener('click', linkHandler);

        return () => document.removeEventListener('click', linkHandler);
    }, [linkHandler]);

    useEffect(() => {
        if ('piTracker' in window && window.piTracker instanceof Function) {
            window.piTracker(trackedUrl);
        }
    }, [trackedUrl]);

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

        // If chat_logged_in_only is enabled, return false unless logged in
        if (flags.chat_logged_in_only && !isLoggedIn) {
            return false;
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
