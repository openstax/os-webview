import React from 'react';
import {render, screen, fireEvent} from '@testing-library/preact';
import mockLocalStorage from '../../helpers/mock-local-storage';
import userEvent from '@testing-library/user-event';
import {
    useSeenCounter,
    usePutAway,
    useStickyData,
    StickyDataWithBanner
} from '~/layouts/default/shared';
import DefaultLayout from '~/layouts/default/default';
import StickyNote from '~/layouts/default/header/sticky-note/sticky-note';
import stickyData from './data/sticky.json';
import fundraiserData from './data/fundraiser.json';
import footerData from './data/footer.json';
import oxmenuData from './data/osmenu.json';
import giveTodayData from './data/give-today.json';
import giveBannerData from './data/givebanner.json';
import * as CF from '~/helpers/cms-fetch';
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

// Having it defined inline caused location updates on every call
let mockPathname = {pathname: '/test-path'};

jest.mock('react-router-dom', () => ({
    useLocation: () => mockPathname
}));

const mockUseSharedDataContext = jest
    .fn()
    .mockReturnValue({});

jest.mock('~/contexts/shared-data', () => ({
    __esModule: true,
    default: () => mockUseSharedDataContext()
}));

const user = userEvent.setup();
const basicImplementation = (path: string) => {
    if (path === 'sticky/') {
        return Promise.resolve({
            ...stickyData
        });
    }
    if (path === 'snippets/givebanner') {
        return Promise.resolve(giveBannerData);
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
        test('useSeenCounter hook works with TypeScript types', async () => {
            const TestComponent = () => {
                const [hasBeenSeenEnough, increment] = useSeenCounter(5);

                return (
                    <div>
                        <span data-testid="seen-enough">
                            {hasBeenSeenEnough.toString()}
                        </span>
                        <button onClick={increment}>Increment</button>
                    </div>
                );
            };

            render(<TestComponent />);
            expect(screen.getByTestId('seen-enough')).toHaveTextContent(
                'false'
            );
            const saveLS = window.localStorage;
            const saveWarn = console.warn;

            console.warn = jest.fn();
            Reflect.deleteProperty(window, 'localStorage');
            await user.click(screen.getByRole('button'));
            expect(console.warn).toHaveBeenCalledWith(
                'LocalStorage restricted'
            );
            Reflect.defineProperty(window, 'localStorage', {value: saveLS});
            console.warn = saveWarn;
        });

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

        test('useStickyData hook handles null return type', () => {
            const TestComponent = () => {
                const data = useStickyData();

                return (
                    <div data-testid="sticky-data">
                        {data ? 'has data' : 'no data'}
                    </div>
                );
            };

            render(<TestComponent />);
            expect(screen.getByTestId('sticky-data')).toHaveTextContent(
                'no data'
            );
        });
        test('useStickyData hook handles emergency mode', async () => {
            mockCmsFetch.mockImplementation((path: string) => {
                if (path === 'sticky/') {
                    /* eslint-disable camelcase */
                    return Promise.resolve({
                        ...stickyData,
                        emergency_expires: '2044-05-31T23:00:00Z'
                    });
                    /* eslint-enable camelcase */
                }
                return basicImplementation(path);
            });
            const TestComponent = () => {
                const data = useStickyData();

                return (
                    <div data-testid="sticky-data">
                        {data ? data.mode : 'no data'}
                    </div>
                );
            };

            render(<TestComponent />);
            expect(await screen.findByTestId('sticky-data')).toHaveTextContent(
                'emergency'
            );
            mockCmsFetch.mockImplementation(basicImplementation);
        });
        test('useStickyData hook handles microdonation not active', async () => {
            mockCmsFetch.mockImplementation((path: string) => {
                if (path === 'sticky/') {
                    return Promise.resolve({
                        ...stickyData,
                        expires: '2024-05-31T23:00:00Z'
                    });
                }
                return basicImplementation(path);
            });
            const TestComponent = () => {
                const data = useStickyData();

                return (
                    <div data-testid="sticky-data">
                        {data && data.mode === null
                            ? 'mode is null'
                            : 'no data'}
                    </div>
                );
            };

            render(<TestComponent />);
            expect(await screen.findByTestId('sticky-data')).toHaveTextContent(
                'mode is null'
            );
            mockCmsFetch.mockImplementation(basicImplementation);
        });
        test('useStickyData hook handles show_popup', async () => {
            mockCmsFetch.mockImplementation((path: string) => {
                if (path === 'sticky/') {
                    /* eslint-disable camelcase */
                    return Promise.resolve({
                        ...stickyData,
                        show_popup: true
                    });
                    /* eslint-enable camelcase */
                }
                return basicImplementation(path);
            });
            const TestComponent = () => {
                const data = useStickyData();

                return (
                    <div data-testid="sticky-data">
                        {data && data.mode === 'popup'
                            ? 'mode is popup'
                            : 'no data'}
                    </div>
                );
            };

            render(<TestComponent />);
            expect(await screen.findByTestId('sticky-data')).toHaveTextContent(
                'mode is popup'
            );
            mockCmsFetch.mockImplementation(basicImplementation);
        });
        test('useStickyData hook handles null emergency_expires', async () => {
            mockCmsFetch.mockImplementation((path: string) => {
                if (path === 'sticky/') {
                    /* eslint-disable camelcase */
                    return Promise.resolve({
                        ...stickyData,
                        emergency_expires: null
                    });
                    /* eslint-enable camelcase */
                }
                return basicImplementation(path);
            });
            const TestComponent = () => {
                const data = useStickyData();

                return (
                    <div data-testid="sticky-data">
                        {data && data.mode === 'banner'
                            ? 'mode is banner'
                            : 'no data'}
                    </div>
                );
            };

            render(<TestComponent />);
            expect(await screen.findByTestId('sticky-data')).toHaveTextContent(
                'mode is banner'
            );
            mockCmsFetch.mockImplementation(basicImplementation);
        });
        test('sticky-note (emergency) renders', () => {
            const data = {
                mode: 'emergency',
                emergency_content: 'The message' // eslint-disable-line camelcase
            } as StickyDataWithBanner;

            render(<StickyNote stickyData={data} />);
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

    beforeAll(() => {
        global.fetch = jest
            .fn()
            .mockImplementation((...args: Parameters<typeof saveFetch>) => {
                const url = args[0] as string;

                if (url.includes('/sticky/')) {
                    return fetchResponse(stickyData);
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
        render(<DefaultLayout />);
        expect(await screen.findAllByText('JIT Load Component')).toHaveLength(
            2
        );
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

        // close on Escape (but not on other keypress)
        await user.click(toggle);
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        fireEvent.keyDown(menuContainer, {key: 'Enter'});
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        fireEvent.keyDown(menuContainer, {key: 'Escape'});
        expect(toggle.getAttribute('aria-expanded')).toBe('false');

        // close on location change (the open is immediately reversed because the path has changed)
        mockPathname = {pathname: '/test-path'};
        await user.click(toggle);
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
    });
});
