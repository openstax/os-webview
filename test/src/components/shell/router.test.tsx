import React from 'react';
import {act, render, screen, waitFor} from '@testing-library/preact';
import '@testing-library/jest-dom';
import {NavigateFunction, useNavigate} from 'react-router-dom';
import Router from '~/components/shell/router';
import * as LayoutContext from '~/contexts/layout';
import * as PortalContext from '~/contexts/portal';
import * as SharedDataContext from '~/contexts/shared-data';
import * as UserContext from '~/contexts/user';
import * as TagManager from '~/helpers/tag-manager';
import * as UsePageData from '~/helpers/use-page-data';
import * as UseLinkHandler from '~/components/shell/router-helpers/use-link-handler';
import * as PageRoutes from '~/components/shell/router-helpers/page-routes';
import MemoryRouter from '~/../../test/helpers/future-memory-router';

declare global {
    interface Window {
        piTracker?: (path: string) => void;
    }
}

// Mock all the necessary modules
jest.mock('~/components/shell/announce-page-title', () => ({
    PageTitleConfirmation: () => (
        <div data-testid="page-title-confirmation">PageTitle</div>
    )
}));

jest.mock('~/components/chat/chat', () => {
    return function MockChat() {
        return <div data-testid="chat-component">Chat Widget</div>;
    };
});

jest.mock('~/components/shell/router-helpers/page-routes', () => ({
    HomePage: () => <div data-testid="home-page">Home</div>,
    ErrataRoutes: () => <div data-testid="errata-routes">Errata</div>,
    DetailsRoutes: () => <div data-testid="details-routes">Details</div>,
    OtherPageRoutes: () => <div data-testid="other-page-routes">Other</div>,
    generateFooterPageRoutes: jest.fn(() => [])
}));

jest.mock('~/components/shell/router-helpers/non-portal-route-wrapper', () => ({
    NonPortalRouteWrapper: ({children}: {children: React.ReactNode}) => (
        <div>{children}</div>
    )
}));

const FOCUSABLE_SELECTOR =
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

jest.mock('~/helpers/$', () => ({
    __esModule: true,
    default: {
        scrollTo: jest.fn()
    }
}));

describe('Router', () => {
    let mockLinkHandler: jest.Mock;
    let mockInitializeGTM: jest.Mock;
    let addEventListenerSpy: jest.SpyInstance;
    let removeEventListenerSpy: jest.SpyInstance;

    beforeEach(() => {
        // Reset window properties
        delete window.piTracker;

        // Create mocks
        mockLinkHandler = jest.fn();
        mockInitializeGTM = jest.fn();

        // Spy on event listeners
        addEventListenerSpy = jest.spyOn(document, 'addEventListener');
        removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

        // Mock dependencies
        jest.spyOn(UseLinkHandler, 'default').mockReturnValue(
            mockLinkHandler
        );
        jest.spyOn(TagManager, 'initializeGTM').mockImplementation(
            mockInitializeGTM
        );

        // Mock contexts with default values
        jest.spyOn(PortalContext, 'default').mockReturnValue({
            portalPrefix: '',
            setPortal: jest.fn(),
            rewriteLinks: jest.fn(),
            isK12Portal: true,
            setIsK12Portal: jest.fn()
        });

        jest.spyOn(SharedDataContext, 'default').mockReturnValue({
            flags: false
        });

        jest.spyOn(UserContext, 'default').mockReturnValue({
            isLoggedIn: false,
            userStatus: {userInfo: {id: null}}
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

        // Mock layout context
        const MockLayout = ({children}: {children: React.ReactNode}) => (
            <div data-testid="layout">{children}</div>
        );

        jest.spyOn(LayoutContext, 'default').mockReturnValue({
            Layout: MockLayout,
            setLayoutParameters: jest.fn()
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

        // Mock page data
        jest.spyOn(UsePageData, 'default').mockReturnValue({});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('scroll reset', () => {
        let navigate: NavigateFunction;

        const Navigator = () => {
            navigate = useNavigate();
            return null;
        };

        const renderAtHome = () => {
            render(
                <MemoryRouter initialEntries={['/']}>
                    <Navigator />
                    <Router />
                </MemoryRouter>
            );
            (window.scrollTo as jest.Mock).mockClear();
        };

        beforeEach(() => {
            window.scrollTo = jest.fn();
        });

        it('scrolls to the top on navigation to a new path', () => {
            renderAtHome();

            act(() => navigate('/subjects'));

            expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
        });

        it('leaves the scroll alone when the destination has a hash', () => {
            renderAtHome();

            act(() => navigate('/subjects#math'));

            expect(window.scrollTo).not.toHaveBeenCalled();
        });
    });

    describe('Router component', () => {
        it('renders without crashing', () => {
            render(
                <MemoryRouter initialEntries={['/']}>
                    <Router />
                </MemoryRouter>
            );

            expect(
                screen.getByTestId('page-title-confirmation')
            ).toBeInTheDocument();
        });

        it('renders skip to content link', () => {
            render(
                <MemoryRouter initialEntries={['/']}>
                    <Router />
                </MemoryRouter>
            );

            const skipLink = screen.getByText('skip to main content');

            expect(skipLink).toBeInTheDocument();
            expect(skipLink.tagName).toBe('A');
            expect(skipLink).toHaveAttribute('href', '#main');
        });

        it('attaches link handler on mount', () => {
            render(
                <MemoryRouter initialEntries={['/']}>
                    <Router />
                </MemoryRouter>
            );

            expect(addEventListenerSpy).toHaveBeenCalledWith(
                'click',
                mockLinkHandler
            );
        });

        it('removes link handler on unmount', () => {
            const {unmount} = render(
                <MemoryRouter initialEntries={['/']}>
                    <Router />
                </MemoryRouter>
            );

            unmount();

            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                'click',
                mockLinkHandler
            );
        });

        it('renders without errors when piTracker is available', () => {
            const mockPiTracker = jest.fn();

            window.piTracker = mockPiTracker;

            expect(() => {
                render(
                    <MemoryRouter initialEntries={['/']}>
                        <Router />
                    </MemoryRouter>
                );
            }).not.toThrow();

            // Verify piTracker exists and is a function (covers line 57 check in router.tsx)
            expect('piTracker' in window).toBe(true);
            expect(typeof window.piTracker).toBe('function');
        });

        it('includes the query string when calling piTracker', async () => {
            const mockPiTracker = jest.fn();

            window.piTracker = (url: string) => mockPiTracker(url);

            render(
                <MemoryRouter initialEntries={['/subjects?utm_source=test']}>
                    <Router />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(mockPiTracker).toHaveBeenCalledWith(expect.stringContaining('?utm_source=test'));
            });
        });

        it('does not call piTracker if it does not exist', () => {
            delete window.piTracker;

            render(
                <MemoryRouter initialEntries={['/']}>
                    <Router />
                </MemoryRouter>
            );

            // Should not throw error
            expect(
                screen.getByTestId('page-title-confirmation')
            ).toBeInTheDocument();
        });

        it('initializes GTM when isK12Portal is false', async () => {
            jest.spyOn(PortalContext, 'default').mockReturnValue({
                portalPrefix: '',
                setPortal: jest.fn(),
                rewriteLinks: jest.fn(),
                isK12Portal: false,
                setIsK12Portal: jest.fn()
            });

            render(
                <MemoryRouter initialEntries={['/']}>
                    <Router />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(mockInitializeGTM).toHaveBeenCalled();
            });
        });

        it('does not initialize GTM when isK12Portal is true', () => {
            jest.spyOn(PortalContext, 'default').mockReturnValue({
                portalPrefix: '',
                setPortal: jest.fn(),
                rewriteLinks: jest.fn(),
                isK12Portal: true,
                setIsK12Portal: jest.fn()
            });

            render(
                <MemoryRouter initialEntries={['/']}>
                    <Router />
                </MemoryRouter>
            );

            expect(mockInitializeGTM).not.toHaveBeenCalled();
        });
    });

    describe('MainRoutes - showChat logic', () => {
        it('does not show chat when flags is false', () => {
            jest.spyOn(SharedDataContext, 'default').mockReturnValue({
                flags: false
            });

            render(
                <MemoryRouter initialEntries={['/details/books/algebra']}>
                    <Router />
                </MemoryRouter>
            );

            expect(
                screen.queryByTestId('chat-component')
            ).not.toBeInTheDocument();
        });

        /* eslint-disable camelcase */
        it('shows chat on book details page when chat_book_details flag is true', () => {
            jest.spyOn(SharedDataContext, 'default').mockReturnValue({
                flags: {
                    chat_book_details: true,
                    chat_subjects: false,
                    chat_contact: false,
                    chat_logged_in_only: false
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any
            });

            render(
                <MemoryRouter initialEntries={['/details/books/algebra']}>
                    <Router />
                </MemoryRouter>
            );

            expect(screen.getByTestId('chat-component')).toBeInTheDocument();
        });

        it('does not show chat on book details page when chat_book_details flag is false', () => {
            jest.spyOn(SharedDataContext, 'default').mockReturnValue({
                flags: {
                    chat_book_details: false,
                    chat_subjects: false,
                    chat_contact: false,
                    chat_logged_in_only: false
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any
            });

            render(
                <MemoryRouter initialEntries={['/details/books/algebra']}>
                    <Router />
                </MemoryRouter>
            );

            expect(
                screen.queryByTestId('chat-component')
            ).not.toBeInTheDocument();
        });

        it('shows chat on subjects page when chat_subjects flag is true', () => {
            jest.spyOn(SharedDataContext, 'default').mockReturnValue({
                flags: {
                    chat_book_details: false,
                    chat_subjects: true,
                    chat_contact: false,
                    chat_logged_in_only: false
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any
            });

            render(
                <MemoryRouter initialEntries={['/subjects']}>
                    <Router />
                </MemoryRouter>
            );

            expect(screen.getByTestId('chat-component')).toBeInTheDocument();
        });

        it('shows chat on subjects sub-page when chat_subjects flag is true', () => {
            jest.spyOn(SharedDataContext, 'default').mockReturnValue({
                flags: {
                    chat_book_details: false,
                    chat_subjects: true,
                    chat_contact: false,
                    chat_logged_in_only: false
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any
            });

            render(
                <MemoryRouter initialEntries={['/subjects/math']}>
                    <Router />
                </MemoryRouter>
            );

            expect(screen.getByTestId('chat-component')).toBeInTheDocument();
        });

        it('shows chat on contact page when chat_contact flag is true', () => {
            jest.spyOn(SharedDataContext, 'default').mockReturnValue({
                flags: {
                    chat_book_details: false,
                    chat_subjects: false,
                    chat_contact: true,
                    chat_logged_in_only: false
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any
            });

            render(
                <MemoryRouter initialEntries={['/contact']}>
                    <Router />
                </MemoryRouter>
            );

            expect(screen.getByTestId('chat-component')).toBeInTheDocument();
        });

        it('does not show chat when chat_logged_in_only is true and user is not logged in', () => {
            jest.spyOn(SharedDataContext, 'default').mockReturnValue({
                flags: {
                    chat_book_details: true,
                    chat_subjects: true,
                    chat_contact: true,
                    chat_logged_in_only: true
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any
            });

            jest.spyOn(UserContext, 'default').mockReturnValue({
                isLoggedIn: false,
                userStatus: {userInfo: {id: null}}
            } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

            render(
                <MemoryRouter initialEntries={['/details/books/algebra']}>
                    <Router />
                </MemoryRouter>
            );

            expect(
                screen.queryByTestId('chat-component')
            ).not.toBeInTheDocument();
        });

        it('shows chat when chat_logged_in_only is true and user is logged in', () => {
            jest.spyOn(SharedDataContext, 'default').mockReturnValue({
                flags: {
                    chat_book_details: true,
                    chat_subjects: false,
                    chat_contact: false,
                    chat_logged_in_only: true
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any
            });

            jest.spyOn(UserContext, 'default').mockReturnValue({
                isLoggedIn: true,
                userStatus: {userInfo: {id: 123}}
            } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

            render(
                <MemoryRouter initialEntries={['/details/books/algebra']}>
                    <Router />
                </MemoryRouter>
            );

            expect(screen.getByTestId('chat-component')).toBeInTheDocument();
        });

        it('does not show chat on non-matching routes even with flags enabled', () => {
            jest.spyOn(SharedDataContext, 'default').mockReturnValue({
                flags: {
                    chat_book_details: true,
                    chat_subjects: true,
                    chat_contact: true,
                    chat_logged_in_only: false
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any
            });

            render(
                <MemoryRouter initialEntries={['/about']}>
                    <Router />
                </MemoryRouter>
            );

            expect(
                screen.queryByTestId('chat-component')
            ).not.toBeInTheDocument();
        });

        it('shows chat when multiple flags match', () => {
            jest.spyOn(SharedDataContext, 'default').mockReturnValue({
                flags: {
                    chat_book_details: true,
                    chat_subjects: true,
                    chat_contact: true,
                    chat_logged_in_only: false
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any
            });

            render(
                <MemoryRouter initialEntries={['/details/books/physics']}>
                    <Router />
                </MemoryRouter>
            );

            expect(screen.getByTestId('chat-component')).toBeInTheDocument();
        });
    });

    describe('Route rendering', () => {
        it('renders HomePage for root path', () => {
            render(
                <MemoryRouter initialEntries={['/']}>
                    <Router />
                </MemoryRouter>
            );

            expect(screen.getByTestId('home-page')).toBeInTheDocument();
        });

        it('renders ErrataRoutes for /errata path', () => {
            render(
                <MemoryRouter initialEntries={['/errata/test']}>
                    <Router />
                </MemoryRouter>
            );

            expect(screen.getByTestId('errata-routes')).toBeInTheDocument();
        });

        it('renders DetailsRoutes for /details path', () => {
            render(
                <MemoryRouter initialEntries={['/details/books/algebra']}>
                    <Router />
                </MemoryRouter>
            );

            expect(screen.getByTestId('details-routes')).toBeInTheDocument();
        });

        it('renders OtherPageRoutes for catch-all path', () => {
            render(
                <MemoryRouter initialEntries={['/about']}>
                    <Router />
                </MemoryRouter>
            );

            expect(screen.getByTestId('other-page-routes')).toBeInTheDocument();
        });

        it('calls generateFooterPageRoutes', () => {
            const mockGenerateFooterPageRoutes = jest.spyOn(
                PageRoutes,
                'generateFooterPageRoutes'
            );

            render(
                <MemoryRouter initialEntries={['/']}>
                    <Router />
                </MemoryRouter>
            );

            expect(mockGenerateFooterPageRoutes).toHaveBeenCalled();
        });
    });

    describe('SkipToContent functionality', () => {
        it('renders skip to content link', () => {
            render(
                <MemoryRouter initialEntries={['/']}>
                    <Router />
                </MemoryRouter>
            );

            const skipLink = screen.getByText('skip to main content');

            expect(skipLink).toBeInTheDocument();
            expect(skipLink.tagName).toBe('A');
            expect(skipLink.getAttribute('href')).toBe('#main');
            expect(skipLink.className).toBe('skiptocontent');
        });

        // The default MockLayout renders no #main at all, which is the state a
        // page is in before a layout chunk resolves.
        const MainWithNothingFocusable = ({
            children
        }: {
            children: React.ReactNode;
        }) => (
            <div id="main" tabIndex={-1}>
                {children}
            </div>
        );

        const renderWithLayout = (
            Layout?: React.ComponentType<{children: React.ReactNode}>
        ) => {
            if (Layout) {
                jest.spyOn(LayoutContext, 'default').mockReturnValue({
                    Layout,
                    setLayoutParameters: jest.fn()
                } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
            }

            render(
                <MemoryRouter initialEntries={['/']}>
                    <Router />
                </MemoryRouter>
            );
        };

        // Dispatching a real event (rather than fireEvent) is what lets us
        // assert on defaultPrevented afterwards.
        const clickSkipLink = () => {
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            });

            act(() => {
                screen.getByText('skip to main content').dispatchEvent(event);
            });

            return event;
        };

        // Elements appended straight to the body, outside the testing-library
        // container it tears down for us.
        let addedElements: HTMLElement[] = [];

        const appendToBody = <T extends HTMLElement>(el: T) => {
            document.body.append(el);
            addedElements.push(el);

            return el;
        };

        const appendMain = () => {
            const mainEl = document.createElement('div');

            mainEl.id = 'main';
            mainEl.tabIndex = -1;

            return appendToBody(mainEl);
        };

        beforeEach(() => {
            addedElements = [];
        });

        afterEach(() => {
            addedElements.forEach((el) => el.remove());
        });

        it('focuses #main when it contains nothing focusable', () => {
            renderWithLayout(MainWithNothingFocusable);

            const event = clickSkipLink();

            expect(
                document.querySelector(`#main ${FOCUSABLE_SELECTOR}`)
            ).toBeNull();
            expect(document.activeElement).toBe(
                document.getElementById('main')
            );
            expect(event.defaultPrevented).toBe(true);
        });

        it('leaves the default anchor behavior alone when #main is missing', () => {
            renderWithLayout();

            expect(document.getElementById('main')).toBeNull();

            const event = clickSkipLink();

            expect(event.defaultPrevented).toBe(false);
        });

        it('focuses #main once it mounts after the click', async () => {
            renderWithLayout();
            clickSkipLink();

            const mainEl = appendMain();

            await waitFor(() => expect(document.activeElement).toBe(mainEl));
        });

        it('leaves focus alone if the user moves on before #main mounts', async () => {
            renderWithLayout();
            clickSkipLink();

            const button = appendToBody(document.createElement('button'));

            button.focus();

            const mainEl = appendMain();

            await waitFor(() =>
                expect(document.body.contains(mainEl)).toBe(true)
            );
            expect(document.activeElement).toBe(button);
        });
    });
});
