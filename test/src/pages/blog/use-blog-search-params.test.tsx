import React from 'react';
import {ComponentType} from 'preact';
import {renderHook, act} from '@testing-library/preact';
import {MemoryRouter} from 'react-router-dom';
import useBlogSearchParams from '~/pages/blog/use-blog-search-params';

type RenderHookWrapper = ComponentType<{children: Element}>;

function wrapperFor(initialUrl: string) {
    function Wrapper({children}: {children: React.ReactNode}) {
        return <MemoryRouter initialEntries={[initialUrl]}>{children}</MemoryRouter>;
    }

    return Wrapper;
}

describe('useBlogSearchParams', () => {
    it('parses q, subjects, collection, sort from the URL', () => {
        const wrapper = wrapperFor('/blog/?q=algebra&subjects=Math,Science&sort=newest') as unknown as RenderHookWrapper;
        const {result} = renderHook(() => useBlogSearchParams(), {
            wrapper
        });

        expect(result.current.q).toBe('algebra');
        expect(result.current.subjects).toEqual(['Math', 'Science']);
        expect(result.current.sort).toBe('newest');
        expect(result.current.collection).toBeUndefined();
    });

    it('setParam updates a single param and preserves the rest', () => {
        const wrapper = wrapperFor('/blog/?q=algebra') as unknown as RenderHookWrapper;
        const {result} = renderHook(() => useBlogSearchParams(), {
            wrapper
        });

        act(() => result.current.setParam('subjects', ['Math']));
        expect(result.current.q).toBe('algebra');
        expect(result.current.subjects).toEqual(['Math']);
    });
});
