import React from 'react';
import {ComponentType} from 'preact';
import {renderHook} from '@testing-library/preact';
import MemoryRouter from '../../../../helpers/future-memory-router';
import {useSelectedLabelTiedToSearchString} from '~/pages/details/desktop-view/desktop-view';

// Lets each test force the tab-selection navigate() to throw a chosen error,
// the way Firefox does when it rate-limits history.replaceState.
let mockNavigateError: Error | null = null;

jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => {
            const realNavigate = actual.useNavigate();

            return (...args: unknown[]) => {
                if (mockNavigateError) {
                    throw mockNavigateError;
                }
                return realNavigate(...args);
            };
        }
    };
});

type RenderHookWrapper = ComponentType<{children: Element}>;

function Wrapper({children}: {children: React.ReactNode}) {
    return <MemoryRouter initialEntries={['/details/books/biology-2e']}>{children}</MemoryRouter>;
}

const wrapper = Wrapper as RenderHookWrapper;
const labels = ['Book details', 'Student resources'];

function renderUpdater() {
    const {result} = renderHook(() => useSelectedLabelTiedToSearchString(labels), {wrapper});

    return result.current[1];
}

describe('useSelectedLabelTiedToSearchString', () => {
    afterEach(() => {
        mockNavigateError = null;
        jest.restoreAllMocks();
    });

    it('swallows the Firefox history-throttle SecurityError', () => {
        mockNavigateError = new DOMException('The operation is insecure.', 'SecurityError');
        const updateSelectedLabel = renderUpdater();

        expect(() => updateSelectedLabel('Student resources')).not.toThrow();
    });

    it('rethrows any other navigation error', () => {
        mockNavigateError = new Error('boom');
        const updateSelectedLabel = renderUpdater();

        expect(() => updateSelectedLabel('Student resources')).toThrow('boom');
    });

    it('skips redundant replaces when the search string is unchanged', () => {
        jest.spyOn(window, 'location', 'get').mockReturnValue({
            ...window.location,
            search: '?Student%20resources'
        });
        // navigate() would throw if called; the unchanged target must
        // short-circuit before touching the History API.
        mockNavigateError = new Error('should not navigate');
        const updateSelectedLabel = renderUpdater();

        expect(() => updateSelectedLabel('Student resources')).not.toThrow();
    });
});
