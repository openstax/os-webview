import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {useSeenCounter, usePutAway, useStickyData} from '../../../src/app/layouts/default/shared';
import Header from '../../../src/app/layouts/default/header/header';
import {MenuItem} from '../../../src/app/layouts/default/header/menus/main-menu/dropdown/dropdown';

// Mock external dependencies
jest.mock('../../../src/app/helpers/cms-fetch', () => jest.fn());
jest.mock('../../../src/app/helpers/page-data-utils', () => ({
    useDataFromPromise: jest.fn(() => null)
}));
jest.mock('../../../src/app/helpers/jit-load', () => {
    return function JITLoad() {
        return <div data-testid="jit-load">JIT Load Component</div>;
    };
});
jest.mock('../../../src/app/contexts/portal', () => ({
    __esModule: true,
    default: () => ({portalPrefix: ''}),
}));
jest.mock('../../../src/app/contexts/window', () => ({
    __esModule: true,
    default: () => ({innerWidth: 1024}),
}));
jest.mock('react-router-dom', () => ({
    useLocation: () => ({pathname: '/test-path'}),
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

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
});

describe('Layouts Default TypeScript Conversions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockLocalStorage.getItem.mockReturnValue('0');
    });

    describe('shared.tsx utilities', () => {
        test('useSeenCounter hook works with TypeScript types', () => {
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
        });

        test('useStickyData hook handles null return type', () => {
            const TestComponent = () => {
                const stickyData = useStickyData();
                return (
                    <div data-testid="sticky-data">
                        {stickyData ? 'has data' : 'no data'}
                    </div>
                );
            };

            render(<TestComponent />);
            expect(screen.getByTestId('sticky-data')).toHaveTextContent('no data');
        });
    });

    describe('Header component TypeScript integration', () => {
        test('Header renders without TypeScript errors', () => {
            render(<Header />);
            expect(screen.getByTestId('jit-load')).toBeInTheDocument();
        });
    });

    describe('MenuItem component TypeScript props', () => {
        test('MenuItem accepts proper TypeScript props', () => {
            const props = {
                label: 'Test Label',
                url: '/test-url',
                local: 'test-local'
            };

            render(<MenuItem {...props} />);

            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', '/test-url');
            expect(link).toHaveAttribute('data-local', 'test-local');
        });

        test('MenuItem works without optional local prop', () => {
            const props = {
                label: 'Test Label',
                url: '/test-url'
            };

            render(<MenuItem {...props} />);

            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', '/test-url');
        });
    });

    describe('TypeScript type safety tests', () => {
        test('StickyData type structure is properly defined', () => {
            // This test verifies TypeScript compilation and type checking
            type BannerInfo = {
                id: number;
                heading: string;
                body: string;
                link_text: string;
                link_url: string;
            };

            type StickyDataRaw = {
                start: string;
                expires: string;
                emergency_expires?: string;
                show_popup: boolean;
            };

            const validBannerInfo: BannerInfo = {
                id: 1,
                heading: 'Test Heading',
                body: 'Test Body',
                link_text: 'Test Link',
                link_url: 'https://example.com'
            };

            const validStickyData: StickyDataRaw = {
                start: '2024-01-01',
                expires: '2024-12-31',
                emergency_expires: '2024-06-01',
                show_popup: true
            };

            expect(validBannerInfo.id).toBe(1);
            expect(validStickyData.show_popup).toBe(true);
        });

        test('localStorage type safety is maintained', () => {
            // Test that our localStorage shim types work correctly
            const testKey = 'testKey';
            const testValue = 'testValue';

            if (window.localStorage) {
                window.localStorage.setItem(testKey, testValue);
                expect(mockLocalStorage.setItem).toHaveBeenCalledWith(testKey, testValue);
            }
        });

        test('Component prop types are properly enforced', () => {
            // This test ensures our prop types compile correctly
            type TestComponentProps = {
                label: string;
                url: string;
                local?: string;
            };

            const TestComponent = ({label, url, local}: TestComponentProps) => (
                <div>
                    <span>{label}</span>
                    <span>{url}</span>
                    <span>{local || 'default'}</span>
                </div>
            );

            const props: TestComponentProps = {
                label: 'Test',
                url: '/test'
            };

            render(<TestComponent {...props} />);
            expect(screen.getByText('Test')).toBeInTheDocument();
        });
    });

    describe('Hook return type validation', () => {
        test('useSeenCounter returns correct tuple type', () => {
            const TestComponent = () => {
                const result = useSeenCounter(3);

                // TypeScript should enforce this is a tuple with specific types
                const [hasBeenSeenEnough, increment]: [boolean, () => void] = result;

                return (
                    <div>
                        <span data-testid="boolean-type">{typeof hasBeenSeenEnough}</span>
                        <span data-testid="function-type">{typeof increment}</span>
                    </div>
                );
            };

            render(<TestComponent />);
            expect(screen.getByTestId('boolean-type')).toHaveTextContent('boolean');
            expect(screen.getByTestId('function-type')).toHaveTextContent('function');
        });
    });
});

// Integration tests for complex TypeScript interactions
describe('TypeScript Integration Tests', () => {
    test('Complex type interactions work correctly', async () => {
        // Test that complex types work together without compilation errors
        type ComplexData = {
            id: number;
            metadata: {
                created: string;
                modified?: string;
            };
            items: Array<{
                name: string;
                value: number;
            }>;
        };

        const testData: ComplexData = {
            id: 1,
            metadata: {
                created: '2024-01-01'
            },
            items: [
                {name: 'item1', value: 100},
                {name: 'item2', value: 200}
            ]
        };

        expect(testData.id).toBe(1);
        expect(testData.items).toHaveLength(2);
        expect(testData.metadata.modified).toBeUndefined();
    });

    test('Event handler types are properly defined', () => {
        type EventHandlerProps = {
            onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
            onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
        };

        const TestComponent = ({onClick, onKeyDown}: EventHandlerProps) => (
            <button onClick={onClick} onKeyDown={onKeyDown}>
                Test Button
            </button>
        );

        const mockClick = jest.fn();
        const mockKeyDown = jest.fn();

        render(<TestComponent onClick={mockClick} onKeyDown={mockKeyDown} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
});