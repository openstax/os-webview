import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import {Book as BookInfo} from '~/pages/subjects/new/specific/context';
import BookTile from '~/components/book-tile/book-tile';
import userEvent from '@testing-library/user-event';

const bookData: BookInfo = {
    id: 46,
    slug: 'sample',
    title: 'Sample Title',
    webviewRexLink: 'link-to-rex',
    webviewLink: 'osweb-link',
    highResolutionPdfUrl: 'hi-res.pdf',
    lowResolutionPdfUrl: '',
    coverUrl: 'cover.jpg'
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
    it('renders', () => {
        const {baseElement} = render(<Component book={[bookData]} />);

        expect(baseElement).toMatchSnapshot();
    });
    it('renders coming soon', async () => {
        render(<Component book={[{...bookData, id: 130}]} />);

        await screen.findByText('Coming soon');
    });
    it('falls back on webviewLink', async () => {
        const save = bookData.webviewRexLink;

        bookData.webviewRexLink = '';
        render(<Component book={[bookData]} />);
        const user = userEvent.setup();

        await user.click(screen.getByRole('button'));

        const links = screen.getAllByRole('link');

        expect(links).toHaveLength(1);

        await user.click(screen.getAllByRole('link')[0]);

        bookData.webviewRexLink = save;
    });
    it('falls back on lowResolutionPdfUrl (may be obsolete)', async () => {
        const save = bookData.highResolutionPdfUrl;

        bookData.lowResolutionPdfUrl = 'low-res.pdf';
        bookData.highResolutionPdfUrl = '';

        render(<Component book={[bookData]} />);

        const user = userEvent.setup();

        const links = screen.getAllByRole('link');

        expect(links).toHaveLength(1);

        await user.click(screen.getAllByRole('link')[0]);

        bookData.highResolutionPdfUrl = save;
    });
});
