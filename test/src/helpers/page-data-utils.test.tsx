import React from 'react';
import {render, screen} from '@testing-library/preact';
import {
    fetchFromCMS,
    getUrlFor,
    useTextFromSlug
} from '~/helpers/page-data-utils';

const mockFetch = jest.fn();

global.fetch = mockFetch;

/* eslint-disable max-nested-callbacks */
describe('page-data-utils', () => {
    describe('fetchFromCMS', () => {
        it('handles 404 response', async () => {
            mockFetch.mockResolvedValueOnce({
                status: 404
            });
            expect(await fetchFromCMS('whatever')).toEqual({
                error: new Error('page not found'),
                slug: 'whatever'
            });
        });
        it('handles error', async () => {
            const saveWarn = console.warn;

            console.warn = jest.fn();
            mockFetch.mockImplementation(() => {
                throw new Error('expected error');
            });
            expect(await fetchFromCMS('whatever')).toEqual({
                error: new Error('expected error'),
                slug: 'whatever'
            });
            expect(console.warn).toHaveBeenCalled();
            console.warn = saveWarn;
        });
    });
    describe('getUrlFor', () => {
        it('leaves url as slug if no book found', async () => {
            expect(await getUrlFor('books/originalslug')).toMatch(
                'books/originalslug/?format=json'
            );
        });
    });
    describe('useTextFromSlug', () => {
        function Component() {
            const {text} = useTextFromSlug('whatever');

            return text ? <div>{(text as Error).message}</div> : null;
        }
        it('sets text to error when response is not ok', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                statusText: 'custom status'
            });
            render(<Component />);
            await screen.findByText('custom status');
        });
        it('uses default error message when response is not ok and no statusText', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false
            });
            render(<Component />);
            await screen.findByText('Failed to load whatever');
        });
        it('sets text to caught fetch error', async () => {
            mockFetch.mockRejectedValueOnce(new Error('expected error'));
            render(<Component />);
            await screen.findByText('expected error');
        });
    });
});
