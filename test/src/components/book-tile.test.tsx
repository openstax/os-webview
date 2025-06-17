import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import {Book as BookInfo} from '~/pages/subjects/new/specific/context';
import BookTile from '~/components/book-tile/book-tile';
import userEvent from '@testing-library/user-event';
import * as CF from '~/helpers/cms-fetch';

const bookData: BookInfo = {
    id: 46,
    slug: 'sample',
    title: 'Sample Title',
    webviewRexLink: 'link-to-rex',
    webviewLink: 'osweb-link',
    highResolutionPdfUrl: 'hi-res.pdf',
    lowResolutionPdfUrl: '',
    coverUrl: 'cover.jpg',
    bookstoreComingSoon: false
};

function Component({book}: {book: [BookInfo]}) {
    return (
        <ShellContextProvider>
            <BookTile book={book} />
        </ShellContextProvider>
    );
}
jest.mock('~/helpers/page-data-utils', () => ({
    ...jest.requireActual('~/helpers/page-data-utils'),
    useDataFromSlug: jest.fn()
}));

/* eslint-disable camelcase */
jest.mock('~/models/book-titles', () => ({
    ...jest.requireActual('~/models/book-titles'),
    __esModule: true,
    default: Promise.resolve([
        {
            id: 46,
            title: 'Prealgebra',
            book_state: 'live',
            promote_snippet: [
                {
                    type: 'content',
                    value: {
                        id: 1,
                        name: 'Assignable',
                        image: 'https://assets.openstax.org/oscms-dev/media/original_images/icons8-image-64.png'
                    },
                    id: 'd6d635c4-990a-44dd-a76a-d007255ba293'
                },
                {
                    type: 'content',
                    value: {
                        id: 2,
                        name: 'Staxly',
                        image: null
                    },
                    id: 'c7c72949-d03f-41fa-93ff-2a5270bba13c'
                }
            ]
        },
        {
            id: 130,
            title: 'Elementary Algebra',
            book_state: 'coming_soon',
            promote_snippet: []
        }
    ])
}));

describe('book-tile', () => {
    const user = userEvent.setup();
    const originalError = console.error;

    it('renders coming soon', async () => {
        render(<Component book={[{...bookData, id: 130}]} />);

        await screen.findByText('Coming soon');
    });
    it('falls back on webviewLink', async () => {
        const noRexData = {...bookData, webviewRexLink: ''};

        render(<Component book={[noRexData]} />);

        await user.click(screen.getByRole('button'));

        const link = screen.getByRole('link');

        console.error = jest.fn();
        await user.click(link);
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('Not implemented: navigation'),
            undefined
        );
        console.error = originalError;
    });
    it('falls back on lowResolutionPdfUrl (may be obsolete)', async () => {
        const lowResPdfData = {
            ...bookData,
            highResolutionPdfUrl: '',
            lowResolutionPdfUrl: 'low-res.pdf'
        };

        render(<Component book={[lowResPdfData]} />);

        const pdfLink = screen.getByRole('menuitem', {
            name: 'Download a PDF'
        });

        console.error = jest.fn();
        expect(screen.queryAllByRole('dialog')).toHaveLength(0);
        await user.click(pdfLink);
        expect(screen.getAllByRole('dialog')).toHaveLength(2);
        console.error = originalError;
    });
    it('hides PDF option if no PDF link', async () => {
        const noPdfData = {
            ...bookData,
            highResolutionPdfUrl: '',
            lowResolutionPdfUrl: ''
        };

        render(<Component book={[noPdfData]} />);
        expect(screen.queryByRole('menuitem', {name: 'Download a PDF'})).toBeNull();
    });

    it('brings up dialog when selecting print copy', async () => {
        render(<Component book={[bookData]} />);
        const printCopyLink = screen.getByRole('menuitem', {
            name: 'Order a print copy'
        });
        const mockCmsFetch = jest
            .spyOn(CF, 'default')
            .mockImplementation(() => {
                return Promise.resolve({
                    amazon_link: 'where you go'
                });
            });

        await userEvent.click(printCopyLink);

        expect(screen.getAllByRole('dialog')).toHaveLength(2);
        mockCmsFetch.mockRestore();
    });
    it('suppresses the print order item when bookstoreComingSoon is true', async () => {
        const bd = {...bookData, bookstoreComingSoon: true};

        render(<Component book={[bd]} />);
        expect(screen.getAllByRole('menuitem')).toHaveLength(4);
    });
});
