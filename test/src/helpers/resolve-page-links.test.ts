import {describe, it, expect, jest, beforeEach} from '@jest/globals';
import resolvePageLinks from '~/helpers/resolve-page-links';
import * as cmsFetchModule from '~/helpers/cms-fetch';

// Mock the cmsFetch module
jest.mock('~/helpers/cms-fetch');

const mockCmsFetch = cmsFetchModule.default as jest.MockedFunction<typeof cmsFetchModule.default>;

describe('resolvePageLinks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns early if element is null', async () => {
        await resolvePageLinks(null);
        expect(mockCmsFetch).not.toHaveBeenCalled();
    });
    });

    it('does nothing if there are no page links', async () => {
        const element = document.createElement('div');

        element.innerHTML = '<p>Some text <a href="/normal-link">normal link</a></p>';

        await resolvePageLinks(element);

        expect(mockCmsFetch).not.toHaveBeenCalled();
    });

    it('resolves a single page link', async () => {
        const element = document.createElement('div');

        element.innerHTML = '<p>Check out <a linktype="page" id="560">this page</a> for more info</p>';

        mockCmsFetch.mockResolvedValue({
            meta: {
                html_url: 'https://openstax.org/some-page'
            }
        });

        await resolvePageLinks(element);

        const link = element.querySelector('a[linktype="page"]') as HTMLAnchorElement;

        expect(mockCmsFetch).toHaveBeenCalledWith('pages/560/');
        expect(link.getAttribute('href')).toBe('https://openstax.org/some-page');
    });

    it('resolves multiple page links', async () => {
        const element = document.createElement('div');

        element.innerHTML = `
            <p>Check out <a linktype="page" id="660">this page</a> and <a linktype="page" id="661">that page</a></p>
        `;

        mockCmsFetch
            .mockResolvedValueOnce({meta: {html_url: 'https://openstax.org/page-660'}})
            .mockResolvedValueOnce({meta: {html_url: 'https://openstax.org/page-661'}});

        await resolvePageLinks(element);

        const links = element.querySelectorAll('a[linktype="page"]');

        expect(mockCmsFetch).toHaveBeenCalledWith('pages/660/');
        expect(mockCmsFetch).toHaveBeenCalledWith('pages/661/');
        expect((links[0] as HTMLAnchorElement).getAttribute('href')).toBe('https://openstax.org/page-660');
        expect((links[1] as HTMLAnchorElement).getAttribute('href')).toBe('https://openstax.org/page-661');
    });

    it('uses cache for repeated page IDs', async () => {
        const element = document.createElement('div');

        element.innerHTML = `
            <p><a linktype="page" id="770">first link</a></p>
        `;

        mockCmsFetch.mockResolvedValue({
            meta: {
                html_url: 'https://openstax.org/cached-page'
            }
        });

        // First call
        await resolvePageLinks(element);

        const firstCallCount = mockCmsFetch.mock.calls.length;

        expect(firstCallCount).toBeGreaterThanOrEqual(1);
        expect((element.querySelector('a') as HTMLAnchorElement).getAttribute('href'))
            .toBe('https://openstax.org/cached-page');

        // Second call with same page ID
        const element2 = document.createElement('div');

        element2.innerHTML = '<p><a linktype="page" id="770">second link</a></p>';

        await resolvePageLinks(element2);

        // Should still have the same call count (using cache)
        expect(mockCmsFetch.mock.calls.length).toBe(firstCallCount);
        expect((element2.querySelector('a') as HTMLAnchorElement).getAttribute('href'))
            .toBe('https://openstax.org/cached-page');
    });

    it('handles API errors gracefully', async () => {
        const element = document.createElement('div');

        element.innerHTML = '<p><a linktype="page" id="880">broken link</a></p>';

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        mockCmsFetch.mockRejectedValueOnce(new Error('API error'));

        await resolvePageLinks(element);

        const link = element.querySelector('a[linktype="page"]') as HTMLAnchorElement;

        // Link should not have href attribute set (or it might be empty)
        const href = link.getAttribute('href');

        expect(href === null || href === '').toBe(true);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Failed to resolve page link for id 880:',
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
    });

    it('handles missing html_url in API response', async () => {
        const element = document.createElement('div');

        element.innerHTML = '<p><a linktype="page" id="888">incomplete data</a></p>';

        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        mockCmsFetch.mockResolvedValue({
            meta: {
                // Missing html_url
            }
        });

        await resolvePageLinks(element);

        const link = element.querySelector('a[linktype="page"]') as HTMLAnchorElement;

        // Link should not have href set
        expect(link.hasAttribute('href')).toBe(false);
        expect(consoleWarnSpy).toHaveBeenCalledWith('Page 888 has no html_url in API response');

        consoleWarnSpy.mockRestore();
    });

    it('ignores links without id attribute', async () => {
        const element = document.createElement('div');

        element.innerHTML = '<p><a linktype="page">no id link</a></p>';

        await resolvePageLinks(element);

        expect(mockCmsFetch).not.toHaveBeenCalled();
    });
});
