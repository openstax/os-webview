import React from 'react';
import {ComponentType} from 'preact';
import {renderHook, act} from '@testing-library/preact';
import MemoryRouter from '../../../helpers/future-memory-router';
import useWebinarSearchParams from '~/pages/webinars/use-webinar-search-params';

type RenderHookWrapper = ComponentType<{children: Element}>;

function wrapperFor(initialUrl: string) {
    function Wrapper({children}: {children: React.ReactNode}) {
        return <MemoryRouter initialEntries={[initialUrl]}>{children}</MemoryRouter>;
    }

    return Wrapper;
}

describe('useWebinarSearchParams', () => {
    it('parses q and sort from the URL', () => {
        const wrapper = wrapperFor('/webinars/search?q=physics&sort=newest') as unknown as RenderHookWrapper;
        const {result} = renderHook(() => useWebinarSearchParams(), {
            wrapper
        });

        expect(result.current.q).toBe('physics');
        expect(result.current.sort).toBe('newest');
    });

    it('defaults to relevance when sort param is missing', () => {
        const wrapper = wrapperFor('/webinars/search?q=biology') as unknown as RenderHookWrapper;
        const {result} = renderHook(() => useWebinarSearchParams(), {
            wrapper
        });

        expect(result.current.q).toBe('biology');
        expect(result.current.sort).toBe('relevance');
    });

    it('defaults to relevance when sort param is invalid', () => {
        const wrapper = wrapperFor('/webinars/search?q=math&sort=invalid') as unknown as RenderHookWrapper;
        const {result} = renderHook(() => useWebinarSearchParams(), {
            wrapper
        });

        expect(result.current.q).toBe('math');
        expect(result.current.sort).toBe('relevance');
    });

    it('returns undefined for q when not present', () => {
        const wrapper = wrapperFor('/webinars/search') as unknown as RenderHookWrapper;
        const {result} = renderHook(() => useWebinarSearchParams(), {
            wrapper
        });

        expect(result.current.q).toBeUndefined();
        expect(result.current.sort).toBe('relevance');
    });

    it('setParam updates sort to newest', () => {
        const wrapper = wrapperFor('/webinars/search?q=chemistry') as unknown as RenderHookWrapper;
        const {result} = renderHook(() => useWebinarSearchParams(), {
            wrapper
        });

        act(() => result.current.setParam('sort', 'newest'));
        expect(result.current.q).toBe('chemistry');
        expect(result.current.sort).toBe('newest');
    });

    it('setParam removes sort when set to undefined (relevance)', () => {
        const wrapper = wrapperFor('/webinars/search?q=algebra&sort=newest') as unknown as RenderHookWrapper;
        const {result} = renderHook(() => useWebinarSearchParams(), {
            wrapper
        });

        expect(result.current.sort).toBe('newest');

        act(() => result.current.setParam('sort', undefined));
        expect(result.current.sort).toBe('relevance');
        expect(result.current.q).toBe('algebra');
    });

    it('setParam updates q and preserves sort', () => {
        const wrapper = wrapperFor('/webinars/search?sort=newest') as unknown as RenderHookWrapper;
        const {result} = renderHook(() => useWebinarSearchParams(), {
            wrapper
        });

        act(() => result.current.setParam('q', 'biology'));
        expect(result.current.q).toBe('biology');
        expect(result.current.sort).toBe('newest');
    });

    it('setParam removes q when set to undefined', () => {
        const wrapper = wrapperFor('/webinars/search?q=test&sort=newest') as unknown as RenderHookWrapper;
        const {result} = renderHook(() => useWebinarSearchParams(), {
            wrapper
        });

        expect(result.current.q).toBe('test');

        act(() => result.current.setParam('q', undefined));
        expect(result.current.q).toBeUndefined();
        expect(result.current.sort).toBe('newest');
    });
});
