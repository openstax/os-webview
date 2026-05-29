import React from 'react';
import {render, waitFor} from '@testing-library/preact';
import {describe, it, expect, jest, beforeEach} from '@jest/globals';
import RawHTML from '~/components/jsx-helpers/raw-html';
import * as cmsFetchModule from '~/helpers/cms-fetch';
import {PortalContextProvider} from '~/contexts/portal';
import MemoryRouter from '~/../../test/helpers/future-memory-router';

// Mock the cmsFetch module
jest.mock('~/helpers/cms-fetch');

const mockCmsFetch = cmsFetchModule.default as jest.MockedFunction<typeof cmsFetchModule.default>;

function Component({html}: {html: string}) {
    return (
        <MemoryRouter initialEntries={['/']}>
            <PortalContextProvider>
                <RawHTML html={html} />
            </PortalContextProvider>
        </MemoryRouter>
    );
}

describe('RawHTML with page links', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders normal HTML without page links', () => {
        const html = '<p>Normal content with <a href="/test">regular link</a></p>';
        const {container} = render(<Component html={html} />);

        expect(container.querySelector('a')?.getAttribute('href')).toBe('/test');
        expect(mockCmsFetch).not.toHaveBeenCalled();
    });

    it('resolves internal page links', async () => {
        const html = '<p>Check out <a linktype="page" id="560">this page</a> for more info</p>';

        mockCmsFetch.mockResolvedValue({
            html_url: 'https://openstax.org/resolved-page'
        });

        const {container} = render(<Component html={html} />);

        // Wait for the async resolution to complete
        await waitFor(() => {
            const link = container.querySelector('a[linktype="page"]') as HTMLAnchorElement;

            expect(link.getAttribute('href')).toBe('https://openstax.org/resolved-page');
        });

        expect(mockCmsFetch).toHaveBeenCalledWith('pages/560/');
    });

    it('resolves multiple page links', async () => {
        const html = `
            <div>
                <p><a linktype="page" id="100">First</a></p>
                <p><a linktype="page" id="200">Second</a></p>
            </div>
        `;

        mockCmsFetch
            .mockResolvedValueOnce({html_url: 'https://openstax.org/page-100'})
            .mockResolvedValueOnce({html_url: 'https://openstax.org/page-200'});

        const {container} = render(<Component html={html} />);

        await waitFor(() => {
            const links = container.querySelectorAll('a[linktype="page"]');

            expect((links[0] as HTMLAnchorElement).getAttribute('href')).toBe('https://openstax.org/page-100');
            expect((links[1] as HTMLAnchorElement).getAttribute('href')).toBe('https://openstax.org/page-200');
        });

        expect(mockCmsFetch).toHaveBeenCalledTimes(2);
    });

    it('handles API errors gracefully', async () => {
        const html = '<p><a linktype="page" id="999">broken link</a></p>';

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        mockCmsFetch.mockRejectedValue(new Error('API error'));

        const {container} = render(<Component html={html} />);

        // Wait a bit for async operations to attempt
        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        // Link should not have href attribute
        const link = container.querySelector('a[linktype="page"]') as HTMLAnchorElement;

        expect(link.hasAttribute('href')).toBe(false);

        consoleErrorSpy.mockRestore();
    });

    it('re-resolves links when html prop changes', async () => {
        const html1 = '<p><a linktype="page" id="990">First page</a></p>';
        const html2 = '<p><a linktype="page" id="991">Second page</a></p>';

        mockCmsFetch
            .mockResolvedValueOnce({html_url: 'https://openstax.org/page-990'})
            .mockResolvedValueOnce({html_url: 'https://openstax.org/page-991'});

        const {container, rerender} = render(<Component html={html1} />);

        await waitFor(() => {
            const link = container.querySelector('a[linktype="page"]') as HTMLAnchorElement;

            expect(link.getAttribute('href')).toBe('https://openstax.org/page-990');
        });

        // Update the HTML prop
        rerender(<Component html={html2} />);

        await waitFor(() => {
            const link = container.querySelector('a[linktype="page"]') as HTMLAnchorElement;

            expect(link.getAttribute('href')).toBe('https://openstax.org/page-991');
        });

        expect(mockCmsFetch).toHaveBeenCalledWith('pages/990/');
        expect(mockCmsFetch).toHaveBeenCalledWith('pages/991/');
    });
});
