import React from 'react';
import {render, screen, fireEvent} from '@testing-library/preact';
import mockLocalStorage from '../../helpers/mock-local-storage';
import userEvent from '@testing-library/user-event';
import {
    usePutAway,
    useBannerData,
    BannerDataWithEmergency
} from '~/layouts/default/shared';
import DefaultLayout from '~/layouts/default/default';
import StickyNote from '~/layouts/default/header/sticky-note/sticky-note';
import emergencyData from './data/emergency.json';
import fundraiserData from './data/fundraiser.json';
import footerData from './data/footer.json';
import oxmenuData from './data/oxmenu.json';
import giveTodayData from './data/give-today.json';
import siteBannerData from './data/sitebanner.json';
import * as CF from '~/helpers/cms-fetch';
import MemoryRouter from '../../../helpers/future-memory-router';
import {Link} from 'react-router-dom';
import * as UUC from '~/contexts/user';
import LoginMenu from '~/layouts/default/header/menus/main-menu/login-menu/login-menu-with-dropdown';
import MenuExpander from '~/layouts/default/header/menus/menu-expander/menu-expander';
import {DropdownContextProvider} from '~/layouts/default/header/menus/dropdown-context';
import '@testing-library/jest-dom';

// Mock external dependencies
jest.mock('~/helpers/jit-load', () => {
    return function JITLoad({importFn}: {importFn: () => Promise<unknown>}) {
        importFn().catch();
        return <div data-testid="jit-load">JIT Load Component</div>;
    };
});
jest.mock('~/contexts/portal', () => ({
    __esModule: true,
    default: () => ({portalPrefix: ''})
}));
jest.mock('~/contexts/window', () => ({
    __esModule: true,
    default: () => ({innerWidth: 1024})
}));

const mockUseSharedDataContext = jest
    .fn()
    .mockReturnValue({});

jest.mock('~/contexts/shared-data', () => {
    const actual = jest.requireActual('~/contexts/shared-data');

    return {
        __esModule: true,
        ...actual,
        default: jest.fn(() => mockUseSharedDataContext()),
        useStreamlinedNav: jest.fn().mockReturnValue(false)
    };
});

const user = userEvent.setup();
const basicImplementation = (path: string) => {
    if (path === 'emergency/') {
        return Promise.resolve({...emergencyData});
    }
    if (path === 'donations/sitebanner/') {
        return Promise.resolve(siteBannerData);
    }
    if (path === 'give-today') {
        return Promise.resolve(giveTodayData);
    }
    console.info('**** Whoops', path);
    return Promise.resolve([]);
};
const mockCmsFetch = jest
    .spyOn(CF, 'default')
    .mockImplementation(basicImplementation);

describe('Layouts Default TypeScript Conversions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockLocalStorage.getItem.mockReturnValue('0');
    });

    describe('shared.tsx utilities', () => {
        test('usePutAway hook returns proper TypeScript types', () => {
            const TestComponent = () => {
                const [closed, PutAwayComponent] = usePutAway();

                return (
                    <div>
                        <span data-testid="closed">{closed.toString()}</span>
                        <PutAwayComponent />
                    </div>
                );
            };

            render(<TestComponent />);
            expect(screen.getByTestId('closed')).toHaveTextContent('false');
            user.click(screen.getByRole('button', {name: 'dismiss'}));
        });

        test('useBannerData hook handles null return type', () => {
            const TestComponent = () => {
                const data = useBannerData();

                return (
                    <div data-testid="banner-data">
                        {data ? 'has data' : 'no data'}
                    </div>
                );
            };

            render(<TestComponent />);
            expect(screen.getByTestId('banner-data')).toHaveTextContent(
                'no data'
            );
        });
        test('useBannerData resolves to banner mode with active banners', async () => {
            const TestComponent = () => {
                const data = useBannerData();

                return (
                    <div data-testid="banner-data">
                        {data ? data.mode : 'no data'}
                    </div>
                );
            };

            render(<TestComponent />);
            expect(await screen.findByTestId('banner-data')).toHaveTextContent(
                'banner'
            );
        });
        test('useBannerData resolves to emergency mode when emergency_expires is in the future', async () => {
            mockCmsFetch.mockImplementation((path: string) => {
                if (path === 'emergency/') {
                    /* eslint-disable camelcase */
                    return Promise.resolve({
                        ...emergencyData,
                        emergency_expires: '2044-05-31T23:00:00Z',
                        emergency_content: 'closed today'
                    });
                    /* eslint-enable camelcase */
                }
                return basicImplementation(path);
            });
            const TestComponent = () => {
                const data = useBannerData();

                return (
                    <div data-testid="banner-data">
                        {data ? data.mode : 'no data'}
                    </div>
                );
            };

            render(<TestComponent />);
            expect(await screen.findByTestId('banner-data')).toHaveTextContent(
                'emergency'
            );
            mockCmsFetch.mockImplementation(basicImplementation);
        });
        test('useBannerData resolves to null mode with no banners', async () => {
            mockCmsFetch.mockImplementation((path: string) => {
                if (path === 'donations/sitebanner/') {
                    return Promise.resolve([]);
                }
                return basicImplementation(path);
            });
            const TestComponent = () => {
                const data = useBannerData();

                return (
                    <div data-testid="banner-data">
                        {data && data.mode === null
                            ? 'mode is null'
                            : 'no data'}
                    </div>
                );
            };

            render(<TestComponent />);
            expect(await screen.findByTestId('banner-data')).toHaveTextContent(
                'mode is null'
            );
            mockCmsFetch.mockImplementation(basicImplementation);
        });
        test('sticky-note (emergency) renders', () => {
            const data = {
                mode: 'emergency',
                emergency_expires: '2044-05-31T23:00:00Z', // eslint-disable-line camelcase
                emergency_content: 'The message', // eslint-disable-line camelcase
                bannerConfigs: []
            } as BannerDataWithEmergency;

            render(<StickyNote bannerData={data} />);
            const alert = screen.getByRole('alert');

            expect(alert.textContent).toBe('The message');
        });
    });
});

describe('default layout', () => {
    const saveFetch = global.fetch;

    function fetchResponse(data: object) {
        return Promise.resolve({
            json: () => Promise.resolve(data)
        });
    }

    const myOpenStaxUser = {
        contact: {
            firstName: 'Roy',
            lastName: 'Johnson'
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggedInUser = {userModel: {id: 16249}, myOpenStaxUser} as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggedOutUser = {} as any;

    const spyUseUserContext = jest.spyOn(UUC, 'default').mockReturnValue(loggedOutUser);

    beforeAll(() => {
        global.fetch = jest
            .fn()
            .mockImplementation((...args: Parameters<typeof saveFetch>) => {
                const url = args[0] as string;

                if (url.includes('/emergency/')) {
                    return fetchResponse(emergencyData);
                }
                if (url.includes('/donations/sitebanner/')) {
                    return fetchResponse(siteBannerData);
                }
                if (url.endsWith('/fundraiser/?format=json')) {
                    return fetchResponse(fundraiserData);
                }
                if (url.endsWith('/footer/?format=json')) {
                    return fetchResponse(footerData);
                }
                if (url.endsWith('/oxmenus/?format=json')) {
                    return fetchResponse(oxmenuData);
                }
                if (url.endsWith('/give-today/')) {
                    return fetchResponse(giveTodayData);
                }
                // console.info('*** Fetch args:', args);
                return saveFetch(...args);
            });
    });
    it('renders; menu opens and closes', async () => {
        render(<MemoryRouter initialEntries={['/webinars']}>
            <DefaultLayout />
            <Link to="/kinetic">Change route</Link>
        </MemoryRouter>);
        expect(await screen.findAllByText('JIT Load Component')).toHaveLength(1);
        const toggle = screen.getByRole('button', {
            name: 'Toggle Meta Navigation Menu'
        });

        expect(toggle.getAttribute('aria-expanded')).toBe('false');
        await user.click(toggle);
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        // Clicking within the popover does not close the popover
        await user.click(document.getElementById('menu-popover')!);
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        // close on outside click
        const overlay = document.querySelector('.menu-popover-overlay')!;
        const menuContainer = overlay.closest('.menus')!;

        await user.click(overlay as Element);
        expect(toggle.getAttribute('aria-expanded')).toBe('false');

        spyUseUserContext.mockReturnValue(loggedInUser);

        // close on Escape (but not on other keypress)
        await user.click(toggle);
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        fireEvent.keyDown(menuContainer, {key: 'Enter'});
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        fireEvent.keyDown(menuContainer, {key: 'Escape'});
        expect(toggle.getAttribute('aria-expanded')).toBe('false');

        // close on location change
        fireEvent.click(screen.getByText('Change route'));
        expect(toggle.getAttribute('aria-expanded')).toBe('false');

        const techMenu = screen.getAllByRole('button', {name: 'Technology'})[0];

        await user.click(techMenu);
        expect(techMenu.getAttribute('aria-expanded')).toBe('false');
        await user.click(techMenu);
        expect(techMenu.getAttribute('aria-expanded')).toBe('true');

        fireEvent.focus(techMenu);
        fireEvent.keyDown(techMenu, {key: 'ArrowDown'});
        expect(document.activeElement?.textContent).toBe('OpenStax Assignable');
        fireEvent.keyDown(techMenu, {key: 'ArrowUp'});
        expect(document.activeElement?.textContent).toBe('Technology arrow');
        fireEvent.keyDown(techMenu, {key: 'ArrowRight'});
        expect(document.activeElement?.textContent).toBe('What we do arrow');
        fireEvent.keyDown(techMenu, {key: 'ArrowLeft'});
        expect(document.activeElement?.textContent).toBe('What we do arrow');
        expect(techMenu.getAttribute('aria-expanded')).toBe('false');
    });
    it('renders login menu', async () => {
        spyUseUserContext.mockReturnValue(loggedInUser);
        render(<MemoryRouter initialEntries={['/webinars']}>
            <LoginMenu />
        </MemoryRouter>);
        await screen.findByText('Account Dashboard');
    });
    it('closes mobile menu on location change', () => {
        const toggleActive = jest.fn();

        render(<DropdownContextProvider>
            <MemoryRouter initialEntries={['/webinars']}>
                <MenuExpander active={true} toggleActive={toggleActive} />
                <Link to="/kinetic">Change route</Link>
            </MemoryRouter>
        </DropdownContextProvider>);
        fireEvent.click(screen.getByText('Change route'));
        expect(toggleActive).toHaveBeenCalledWith(false);
    });
    it('renders login-menu options based on userModel', async () => {
        spyUseUserContext.mockReturnValue({
            myOpenStaxUser: {
                error: 'true'
            },
            // @ts-expect-error userModel missssing properties
            userModel: {
                instructorEligible: true,
                incompleteSignup: true,
                pendingInstructorAccess: true,
                emailUnverified: true
            }
        });
        render(<MemoryRouter initialEntries={['/webinars']}>
            <LoginMenu />
        </MemoryRouter>);
        screen.getByRole('link', {name: 'Account Profile'});
        screen.getByRole('link', {name: 'Request instructor access'});
        screen.getByRole('link', {name: 'Complete your profile'});
        screen.getByRole('link', {name: 'Pending instructor access'});
        screen.getByRole('link', {name: 'Verify your email address'});
    });
});
