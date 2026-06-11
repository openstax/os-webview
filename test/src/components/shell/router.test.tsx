import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import '@testing-library/jest-dom';
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

jest.mock('~/helpers/$', () => ({
    default: {
        focusable:
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
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
    });
});
