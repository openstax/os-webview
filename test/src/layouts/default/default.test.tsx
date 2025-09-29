import React from 'react';
import {render, screen, fireEvent} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {useSeenCounter, usePutAway, useStickyData} from '~/layouts/default/shared';
import {MenuItem} from '~/layouts/default/header/menus/main-menu/dropdown/dropdown';
import DefaultLayout from '~/layouts/default/default';
import stickyData from './data/sticky.json';
import fundraiserData from './data/fundraiser.json';
import footerData from './data/footer.json';
import oxmenuData from './data/osmenu.json';
import giveTodayData from './data/give-today.json';
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
// jest.mock('~/layouts/default/microsurvey-popup/microsurvey-popup', () => ({
//     __esModule: true,
//     default: () => <></>
// }));

const mockUseSharedDataContext = jest.fn().mockReturnValue({stickyFooterState: [false, () => undefined]});

jest.mock('~/contexts/shared-data', () => ({
    __esModule: true,
    default: () => mockUseSharedDataContext()
}));

// Mock localStorage
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    key: jest.fn(),
    length: 0,
    visitedGive: '0',
    campaignId: ''
};

Reflect.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
});

const user = userEvent.setup();

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
                        <span data-testid="seen-enough">{hasBeenSeenEnough.toString()}</span>
                        <button onClick={increment}>Increment</button>
                    </div>
                );
            };

            render(<TestComponent />);
            expect(screen.getByTestId('seen-enough')).toHaveTextContent('false');
            const saveLS = window.localStorage;
            const saveWarn = console.warn;

            console.warn = jest.fn();
            Reflect.deleteProperty(window, 'localStorage');
            await user.click(screen.getByRole('button'));
            expect(console.warn).toHaveBeenCalledWith('LocalStorage restricted');
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
            expect(screen.getByTestId('sticky-data')).toHaveTextContent('no data');
        });
    });

//     describe('MenuItem component TypeScript props', () => {
//         test('MenuItem accepts proper TypeScript props', () => {
//             const props = {
//                 label: 'Test Label',
//                 url: '/test-url',
//                 local: 'test-local'
//             };

//             render(<MenuItem {...props} />);

//             const link = screen.getByRole('link');

//             expect(link).toHaveAttribute('href', '/test-url');
//             expect(link).toHaveAttribute('data-local', 'test-local');
//         });

//         test('MenuItem works without optional local prop', () => {
//             const props = {
//                 label: 'Test Label',
//                 url: '/test-url'
//             };

//             render(<MenuItem {...props} />);

//             const link = screen.getByRole('link');

//             expect(link).toHaveAttribute('href', '/test-url');
//         });
//     });

//     describe('TypeScript type safety tests', () => {
//         test('StickyData type structure is properly defined', () => {
//             // This test verifies TypeScript compilation and type checking
//             type BannerInfo = {
//                 id: number;
//                 heading: string;
//                 body: string;
//                 link_text: string;
//                 link_url: string;
//             };

//             type StickyDataRaw = {
//                 start: string;
//                 expires: string;
//                 emergency_expires?: string;
//                 show_popup: boolean;
//             };

//             /* eslint-disable camelcase */
//             const validBannerInfo: BannerInfo = {
//                 id: 1,
//                 heading: 'Test Heading',
//                 body: 'Test Body',
//                 link_text: 'Test Link',
//                 link_url: 'https://example.com'
//             };

//             const validStickyData: StickyDataRaw = {
//                 start: '2024-01-01',
//                 expires: '2024-12-31',
//                 emergency_expires: '2024-06-01',
//                 show_popup: true
//             };
//             /* eslint-enable camelcase */

//             expect(validBannerInfo.id).toBe(1);
//             expect(validStickyData.show_popup).toBe(true);
//         });

//         test('localStorage type safety is maintained', () => {
//             // Test that our localStorage shim types work correctly
//             const testKey = 'testKey';
//             const testValue = 'testValue';

//             if (window.localStorage) {
//                 window.localStorage.setItem(testKey, testValue);
//                 expect(mockLocalStorage.setItem).toHaveBeenCalledWith(testKey, testValue);
//             }
//         });

//         test('Component prop types are properly enforced', () => {
//             // This test ensures our prop types compile correctly
//             type TestComponentProps = {
//                 label: string;
//                 url: string;
//                 local?: string;
//             };

//             const TestComponent = ({label, url, local}: TestComponentProps) => (
//                 <div>
//                     <span>{label}</span>
//                     <span>{url}</span>
//                     <span>{local || 'default'}</span>
//                 </div>
//             );

//             const props: TestComponentProps = {
//                 label: 'Test',
//                 url: '/test'
//             };

//             render(<TestComponent {...props} />);
//             expect(screen.getByText('Test')).toBeInTheDocument();
//         });
//     });

//     describe('Hook return type validation', () => {
//         test('useSeenCounter returns correct tuple type', () => {
//             const TestComponent = () => {
//                 const result = useSeenCounter(3);

//                 // TypeScript should enforce this is a tuple with specific types
//                 const [hasBeenSeenEnough, increment]: [boolean, () => void] = result;

//                 return (
//                     <div>
//                         <span data-testid="boolean-type">{typeof hasBeenSeenEnough}</span>
//                         <span data-testid="function-type">{typeof increment}</span>
//                     </div>
//                 );
//             };

//             render(<TestComponent />);
//             expect(screen.getByTestId('boolean-type')).toHaveTextContent('boolean');
//             expect(screen.getByTestId('function-type')).toHaveTextContent('function');
//         });
//     });
});

describe('default layout', () => {
    const saveFetch = global.fetch;

    function fetchResponse(data: object) {
        return Promise.resolve({
            json: () => Promise.resolve(data)
        });
    }

    beforeAll(() => {
        global.fetch = jest.fn().mockImplementation((...args: Parameters<typeof saveFetch>) => {
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
        expect(await screen.findAllByText('JIT Load Component')).toHaveLength(2);
        const toggle = screen.getByRole('button', {name: 'Toggle Meta Navigation Menu'});

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

// Integration tests for complex TypeScript interactions
// describe('TypeScript Integration Tests', () => {
//     test('Complex type interactions work correctly', async () => {
//         // Test that complex types work together without compilation errors
//         type ComplexData = {
//             id: number;
//             metadata: {
//                 created: string;
//                 modified?: string;
//             };
//             items: Array<{
//                 name: string;
//                 value: number;
//             }>;
//         };

//         const testData: ComplexData = {
//             id: 1,
//             metadata: {
//                 created: '2024-01-01'
//             },
//             items: [
//                 {name: 'item1', value: 100},
//                 {name: 'item2', value: 200}
//             ]
//         };

//         expect(testData.id).toBe(1);
//         expect(testData.items).toHaveLength(2);
//         expect(testData.metadata.modified).toBeUndefined();
//     });

//     test('Event handler types are properly defined', () => {
//         type EventHandlerProps = {
//             onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
//             onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
//         };

//         const TestComponent = ({onClick, onKeyDown}: EventHandlerProps) => (
//             <button onClick={onClick} onKeyDown={onKeyDown}>
//                 Test Button
//             </button>
//         );

//         const mockClick = jest.fn();
//         const mockKeyDown = jest.fn();

//         render(<TestComponent onClick={mockClick} onKeyDown={mockKeyDown} />);
//         expect(screen.getByRole('button')).toBeInTheDocument();
//     });
// });
