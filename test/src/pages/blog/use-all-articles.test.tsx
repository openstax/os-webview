import React from 'react';
import {renderHook, waitFor} from '@testing-library/preact';
import {MemoryRouter} from 'react-router-dom';
import * as pageDataUtils from '~/helpers/page-data-utils';
import useAllArticles from '~/pages/blog/search-results/use-all-articles';

afterEach(() => jest.restoreAllMocks());

it('builds the search slug from q, subjects, collection, and sort', async () => {
    const spy = jest.spyOn(pageDataUtils, 'fetchFromCMS').mockResolvedValue([]);

    function Wrapper({children}: {children: React.ReactNode}) {
        return (
            <MemoryRouter initialEntries={['/blog/?q=algebra&subjects=Math&sort=newest']}>
                {children}
            </MemoryRouter>
        );
    }

    renderHook(() => useAllArticles(), {wrapper: Wrapper});

    await waitFor(() => expect(spy).toHaveBeenCalled());
    const slug = spy.mock.calls[0][0] as string;

    expect(slug).toContain('q=algebra');
    expect(slug).toContain('subjects=Math');
    expect(slug).toContain('sort=newest');
});

it('includes collection in the slug when present', async () => {
    const spy = jest.spyOn(pageDataUtils, 'fetchFromCMS').mockResolvedValue([]);

    function Wrapper({children}: {children: React.ReactNode}) {
        return (
            <MemoryRouter initialEntries={['/blog/?q=algebra&collection=OpenStax%20Updates']}>
                {children}
            </MemoryRouter>
        );
    }

    renderHook(() => useAllArticles(), {wrapper: Wrapper});

    await waitFor(() => expect(spy).toHaveBeenCalled());
    const slug = spy.mock.calls[0][0] as string;
    const url = new URL(slug, 'https://example.com/');

    expect(url.searchParams.get('collection')).toBe('OpenStax Updates');
});

it('omits sort from the slug when sort is relevance (the default)', async () => {
    const spy = jest.spyOn(pageDataUtils, 'fetchFromCMS').mockResolvedValue([]);

    function WrapperNoSort({children}: {children: React.ReactNode}) {
        return (
            <MemoryRouter initialEntries={['/blog/?q=algebra']}>
                {children}
            </MemoryRouter>
        );
    }

    renderHook(() => useAllArticles(), {wrapper: WrapperNoSort});

    await waitFor(() => expect(spy).toHaveBeenCalled());
    const slugNoSort = spy.mock.calls[0][0] as string;

    expect(slugNoSort).not.toContain('sort=');

    jest.restoreAllMocks();
    const spy2 = jest.spyOn(pageDataUtils, 'fetchFromCMS').mockResolvedValue([]);

    function WrapperRelevance({children}: {children: React.ReactNode}) {
        return (
            <MemoryRouter initialEntries={['/blog/?q=algebra&sort=relevance']}>
                {children}
            </MemoryRouter>
        );
    }

    renderHook(() => useAllArticles(), {wrapper: WrapperRelevance});

    await waitFor(() => expect(spy2).toHaveBeenCalled());
    const slugRelevance = spy2.mock.calls[0][0] as string;

    expect(slugRelevance).not.toContain('sort=');
});
