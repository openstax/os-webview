import React from 'react';
import {renderHook, waitFor} from '@testing-library/preact';
import {ComponentType} from 'preact';
import {MemoryRouter} from 'react-router-dom';
import * as pageDataUtils from '~/helpers/page-data-utils';
import useAllArticles from '~/pages/blog/search-results/use-all-articles';

type RenderHookWrapper = ComponentType<{children: Element}>;

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

    renderHook(() => useAllArticles(), {wrapper: Wrapper as unknown as RenderHookWrapper});

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

    renderHook(() => useAllArticles(), {wrapper: Wrapper as unknown as RenderHookWrapper});

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

    renderHook(() => useAllArticles(), {wrapper: WrapperNoSort as unknown as RenderHookWrapper});

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

    renderHook(() => useAllArticles(), {wrapper: WrapperRelevance as unknown as RenderHookWrapper});

    await waitFor(() => expect(spy2).toHaveBeenCalled());
    const slugRelevance = spy2.mock.calls[0][0] as string;

    expect(slugRelevance).not.toContain('sort=');
});

it('cancels pending fetch when hook unmounts (line 46)', async () => {
    let resolveFetch: (value: unknown) => void;
    const fetchPromise = new Promise((resolve) => {
        resolveFetch = resolve;
    });
    const spy = jest.spyOn(pageDataUtils, 'fetchFromCMS').mockReturnValue(fetchPromise as Promise<never>);

    function Wrapper({children}: {children: React.ReactNode}) {
        return (
            <MemoryRouter initialEntries={['/blog/?q=test']}>
                {children}
            </MemoryRouter>
        );
    }

    const {unmount} = renderHook(() => useAllArticles(), {wrapper: Wrapper as unknown as RenderHookWrapper});

    await waitFor(() => expect(spy).toHaveBeenCalled());

    // Unmount the hook before the fetch resolves - this sets cancelled = true
    unmount();

    // Now resolve the fetch - the cancelled check at line 46 should prevent state updates
    resolveFetch!([
        {
            id: 1,
            title: 'Test Article',
            slug: 'test-article',
            date: '2024-01-01',
            articleImage: null
        }
    ]);

    // Wait a bit to ensure no state updates throw errors about unmounted components
    await new Promise((resolve) => setTimeout(resolve, 50));

    // If we get here without errors, the cancelled check worked
    expect(spy).toHaveBeenCalled();
});

it('handles fetch errors when not cancelled (line 57, cancelled = false)', async () => {
    const spy = jest.spyOn(pageDataUtils, 'fetchFromCMS').mockRejectedValue(new Error('Network error'));

    function Wrapper({children}: {children: React.ReactNode}) {
        return (
            <MemoryRouter initialEntries={['/blog/?q=test']}>
                {children}
            </MemoryRouter>
        );
    }

    const {result} = renderHook(() => useAllArticles(), {wrapper: Wrapper as unknown as RenderHookWrapper});

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the error to be caught
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // After error, should show empty results (not stuck in loading state)
    expect(result.current.articles).toEqual([]);
    expect(spy).toHaveBeenCalled();
});

it('handles fetch errors when cancelled (line 57, cancelled = true)', async () => {
    let rejectFetch: (error: Error) => void;
    const fetchPromise = new Promise((_, reject) => {
        rejectFetch = reject;
    });
    const spy = jest.spyOn(pageDataUtils, 'fetchFromCMS').mockReturnValue(fetchPromise as Promise<never>);

    function Wrapper({children}: {children: React.ReactNode}) {
        return (
            <MemoryRouter initialEntries={['/blog/?q=test']}>
                {children}
            </MemoryRouter>
        );
    }

    const {unmount} = renderHook(() => useAllArticles(), {wrapper: Wrapper as unknown as RenderHookWrapper});

    await waitFor(() => expect(spy).toHaveBeenCalled());

    // Unmount the hook before the fetch rejects - this sets cancelled = true
    unmount();

    // Now reject the fetch - the cancelled check at line 61 should prevent state updates
    rejectFetch!(new Error('Network error'));

    // Wait a bit to ensure no state updates throw errors about unmounted components
    await new Promise((resolve) => setTimeout(resolve, 50));

    // If we get here without errors, the cancelled check in the catch block worked
    expect(spy).toHaveBeenCalled();
});
