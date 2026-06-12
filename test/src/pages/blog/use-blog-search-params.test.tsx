import React from 'react';
import {ComponentType} from 'preact';
import {renderHook, act} from '@testing-library/preact';
import {MemoryRouter} from 'react-router-dom';
import useBlogSearchParams from '~/pages/blog/use-blog-search-params';

function wrapperFor(initialUrl: string) {
    function Wrapper({children}: {children: React.ReactNode}) {
        return <MemoryRouter initialEntries={[initialUrl]}>{children}</MemoryRouter>;
    }

    return Wrapper;
}

describe('useBlogSearchParams', () => {
    it('parses q, subjects, collection, sort from the URL', () => {
        const {result} = renderHook(() => useBlogSearchParams(), {
            wrapper: wrapperFor('/blog/?q=algebra&subjects=Math,Science&sort=newest') as ComponentType<{children: Element}>
        });

        expect(result.current.q).toBe('algebra');
        expect(result.current.subjects).toEqual(['Math', 'Science']);
        expect(result.current.sort).toBe('newest');
        expect(result.current.collection).toBeUndefined();
    });

    it('setParam updates a single param and preserves the rest', () => {
        const {result} = renderHook(() => useBlogSearchParams(), {
            wrapper: wrapperFor('/blog/?q=algebra') as ComponentType<{children: Element}>
        });

        act(() => result.current.setParam('subjects', ['Math']));
        expect(result.current.q).toBe('algebra');
        expect(result.current.subjects).toEqual(['Math']);
    });
});
