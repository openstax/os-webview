import React from 'react';
import {render, screen} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import {LanguageContextProvider} from '~/contexts/language';
import {Book as BookInfo} from '~/pages/subjects/new/specific/context';
import BookTile from '~/components/book-tile/book-tile';
import BookTileDisplay from '~/components/book-tile/book-tile-display';
import userEvent from '@testing-library/user-event';
import * as CF from '~/helpers/cms-fetch';
import usePortalContext, {PortalContextProvider} from '~/contexts/portal';
import '@testing-library/jest-dom';

const bookData: BookInfo = {
    id: 46,
    slug: 'sample',
    title: 'Sample Title',
    webviewRexLink: 'link-to-rex',
    webviewLink: 'osweb-link',
    pdfUrl: 'hi-res.pdf',
    highResolutionPdfUrl: 'hi-res.pdf',
    coverUrl: 'cover.jpg',
    bookstoreComingSoon: false,
    description: ''
};

function Component({book}: {book: [BookInfo]}) {
    return (
        <MemoryRouter>
            <ShellContextProvider>
                <BookTile book={book} />
            </ShellContextProvider>
        </MemoryRouter>
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
    it('hides PDF option if no PDF link', async () => {
        const noPdfData = {
            ...bookData,
            pdfUrl: '',
            highResolutionPdfUrl: ''
        };

        render(<Component book={[noPdfData]} />);
        expect(screen.queryByRole('menuitem', {name: 'Download a PDF'})).toBeNull();
    });

    it('brings up dialog when selecting print copy', async () => {
        render(<Component book={[bookData]} />);
        const printCopyLink = screen.getByRole('menuitem', {
            name: 'Order a print copy'
        });
        const mockCmsFetch = jest.spyOn(CF, 'default');

        mockCmsFetch.mockResolvedValue({
            amazon_link: 'where you go'
        });

        await userEvent.click(printCopyLink);

        expect(screen.getAllByRole('dialog')).toHaveLength(2);
        mockCmsFetch.mockRestore();
    });
    it('includes audiobook link', async () => {
        render(<Component book={[bookData]} />);
        const printCopyLink = screen.getByRole('menuitem', {
            name: 'Order a print copy'
        });
        const mockCmsFetch = jest.spyOn(CF, 'default');

        mockCmsFetch.mockResolvedValue({
            amazon_link: 'where you go',
            audiobook_link: 'audio-book-link'
        });

        await userEvent.click(printCopyLink);
        mockCmsFetch.mockRestore();

        expect(screen.getAllByText('Audiobook')).toHaveLength(2);
    });
    it('suppresses the print order item when bookstoreComingSoon is true', async () => {
        const bd = {...bookData, bookstoreComingSoon: true};

        render(<Component book={[bd]} />);
        const menuItems = screen.getAllByRole('menuitem').map((i) => i.textContent);

        expect(menuItems.includes('View online')).toBe(true);
        expect(menuItems.includes('Order a print copy')).toBe(false);
    });
    it('suppresses "View online" if no Rex link', async () => {
        const bd = {...bookData, webviewRexLink: null};

        render(<Component book={[bd]} />);
        const menuItems = screen.getAllByRole('menuitem').map((i) => i.textContent);

        expect(menuItems.includes('View online')).toBe(false);
        expect(menuItems.includes('Order a print copy')).toBe(true);
    });
});

describe('book-tile-display portal link rewriting', () => {
    it('does not rewrite links when portalPrefix matches pathname', () => {
        const ComponentWithMatchingPath = () => {
            const {setPortal} = usePortalContext();

            // Set portal to match the pathname
            setPortal('k12');

            return (
                <LanguageContextProvider>
                    <MemoryRouter initialEntries={['/k12']}>
                        <BookTileDisplay book={bookData} />
                    </MemoryRouter>
                </LanguageContextProvider>
            );
        };

        render(
            <PortalContextProvider>
                <ComponentWithMatchingPath />
            </PortalContextProvider>
        );

        // The link should remain as-is (not double-prefixed)
        const link = screen.getByRole('link', {name: /Sample Title book/i});

        expect(link).toHaveAttribute('href', '/details/sample');
    });

    it('rewrites links when portalPrefix differs from pathname', () => {
        const ComponentWithDifferentPath = () => {
            const {setPortal} = usePortalContext();

            // Set portal but use a different pathname (simulating a sub-page)
            setPortal('k12');

            return (
                <LanguageContextProvider>
                    <MemoryRouter initialEntries={['/k12/subjects/math']}>
                        <BookTileDisplay book={bookData} />
                    </MemoryRouter>
                </LanguageContextProvider>
            );
        };

        render(
            <PortalContextProvider>
                <ComponentWithDifferentPath />
            </PortalContextProvider>
        );

        // The link should be prefixed with the portal
        const link = screen.getByRole('link', {name: /Sample Title book/i});

        expect(link).toHaveAttribute('href', '/k12/details/sample');
    });

    it('handles trailing slashes in pathname comparison', () => {
        const ComponentWithTrailingSlash = () => {
            const {setPortal} = usePortalContext();

            // Set portal and use pathname with trailing slash
            setPortal('k12');

            return (
                <MemoryRouter initialEntries={['/k12/']}>
                    <BookTileDisplay book={bookData} />
                </MemoryRouter>
            );
        };

        render(
            <LanguageContextProvider>
                <PortalContextProvider>
                    <ComponentWithTrailingSlash />
                </PortalContextProvider>
            </LanguageContextProvider>
        );

        // The link should remain as-is (pathname normalized, so /k12/ matches /k12)
        const link = screen.getByRole('link', {name: /Sample Title book/i});

        expect(link).toHaveAttribute('href', '/details/sample');
    });
});
