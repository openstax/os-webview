import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import GetThisTitle, {Model} from '~/pages/details/common/get-this-title';
import {TOCContextProvider} from '~/pages/details/common/toc-slideout/context';
import BookDetailsLoader from '../book-details-context';
import * as UDH from '~/helpers/use-document-head';
import $ from '~/helpers/$';
import * as TL from '~/pages/details/common/track-link';
import * as UC from '~/contexts/user';
// College algebra book details
import details from '../../../data/details-college-algebra';
import {transformData, camelCaseKeys, Json} from '~/helpers/page-data-utils';
import Cookies from 'js-cookie';

const baseModel = camelCaseKeys(transformData(details as Record<string, Json>)) as Model;

function GTTinContext({model = baseModel}) {
    return (
        <BookDetailsLoader slug="books/college-algebra">
            <TOCContextProvider>
                <GetThisTitle model={model} />
            </TOCContextProvider>
        </BookDetailsLoader>
    );
}

const mockIsMobileDisplay = jest.fn().mockReturnValue(false);

jest.mock('~/helpers/device', () => ({
    ...jest.requireActual('~/helpers/device'),
    __esModule: true,
    isMobileDisplay: () => mockIsMobileDisplay()
}));

jest.spyOn(UDH, 'setPageTitleAndDescriptionFromBookData').mockImplementation(
    () => null
);
jest.spyOn(UC, 'UserContextProvider').mockImplementation(
    ({children}: any) => children // eslint-disable-line
);
const mockTrackLink = jest.spyOn(TL, 'default');

const user = userEvent.setup();

describe('get-this-title', () => {
    const originalError = console.error;

    // Reset the give-dialog frequency cap and mobile mock so each click test
    // starts uncapped on a desktop display.
    beforeEach(() => {
        window.localStorage.removeItem('giveDialogLastDisplay');
        mockIsMobileDisplay.mockReturnValue(false);
    });

    it('renders with unexpanded options', async () => {
        const bookshareModel = {...baseModel, bookshareLink: 'the-bookshare-version'};

        render(<GTTinContext model={bookshareModel} />);
        const expander = await screen.findByText('+ 1 more option...');

        await user.click(expander);
        await screen.findByText('See 1 fewer option');
        screen.getByRole('link', {name: 'Bookshare'});
    });
    it('shows no expander if not needed', async () => {
        render(<GTTinContext />);
        await screen.findByText('Download a PDF');

        expect(screen.queryByText(/more option/)).toBeNull();
    });
    it('opens give dialog for Webview', async () => {
        render(<GTTinContext />);
        const wvLink = await screen.findByText('View online');

        await user.click(wvLink);

        expect(screen.getAllByRole('dialog')).toHaveLength(2);
        const trackingLink = await screen.findByRole('link', {
            name: 'Go to your book'
        });

        console.error = jest.fn();
        await user.click(trackingLink);
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('Not implemented: navigation'),
            undefined
        );
        console.error = originalError;
        expect(mockTrackLink).toHaveBeenCalled();
        mockTrackLink.mockReset();
    });
    it('opens give dialog for PDF', async () => {
        render(<GTTinContext />);
        const pdfLink = await screen.findByText('Download a PDF');

        await user.click(pdfLink);
        expect(screen.getAllByRole('dialog')).toHaveLength(2);
        const trackingLink = await screen.findByRole('link', {
            name: 'Go to your file'
        });

        console.error = jest.fn();
        await user.click(trackingLink);
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('Not implemented: navigation'),
            undefined
        );
        console.error = originalError;
        expect(mockTrackLink).toHaveBeenCalled();
        mockTrackLink.mockReset();
    });
    it('no dialog on mobile display', async () => {
        mockIsMobileDisplay.mockReturnValue(true);
        render(<GTTinContext />);
        const pdfLink = await screen.findByText('Download a PDF');

        console.error = jest.fn();
        await user.click(pdfLink);
        expect(screen.queryAllByRole('dialog')).toHaveLength(0);
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('Not implemented: navigation'),
            undefined
        );
        console.error = originalError;
    });
    it('does not reopen the dialog when shown recently', async () => {
        window.localStorage.setItem(
            'giveDialogLastDisplay',
            JSON.stringify(Date.now())
        );
        render(<GTTinContext />);
        const pdfLink = await screen.findByText('Download a PDF');

        console.error = jest.fn();
        await user.click(pdfLink);
        expect(screen.queryByRole('link', {name: 'Go to your file'})).toBeNull();
        console.error = originalError;
    });
    it('records an impression when the dialog opens', async () => {
        (window as unknown as Window & {dataLayer: object[]}).dataLayer = [];
        render(<GTTinContext />);
        const pdfLink = await screen.findByText('Download a PDF');

        await user.click(pdfLink);
        expect(window.dataLayer).toContainEqual({
            event: 'giveDialogImpression'
        });
    });
    it('labels the option links so a capped download still gets reported', async () => {
        window.localStorage.setItem('giveDialogLastDisplay', String(Date.now()));
        render(<GTTinContext />);
        const pdfLink = await screen.findByText('Download a PDF');

        // GetThisTitle's delegated handler calls trackLink for every option
        // click, but it only builds tracking info for links carrying
        // data-track - which used to live on the dialog's link alone.
        expect(pdfLink.closest('a')?.dataset.track).toBe('PDF');

        console.error = jest.fn();
        await user.click(pdfLink);
        console.error = originalError;

        expect(screen.queryByRole('link', {name: 'Go to your file'})).toBeNull();
        expect(mockTrackLink).toHaveBeenCalled();
        mockTrackLink.mockReset();
    });
    it('labels the view-online link the same way', async () => {
        render(<GTTinContext />);
        const onlineLink = await screen.findByText('View online');

        expect(onlineLink.closest('a')?.dataset.track).toBe('Online');
    });
    it('shows a content warning even when the dialog fired recently', async () => {
        const warned = {...baseModel, contentWarningText: 'Heads up about this book'};

        window.localStorage.setItem('giveDialogLastDisplay', String(Date.now()));
        (window as unknown as Window & {dataLayer: object[]}).dataLayer = [];
        render(<GTTinContext model={warned} />);

        await user.click(await screen.findByText('Download a PDF'));

        await screen.findByText('Heads up about this book');
        expect(window.dataLayer).not.toContainEqual({
            event: 'giveDialogImpression'
        });
    });
    it('asks for a donation once the content warning is acknowledged', async () => {
        const warned = {...baseModel, contentWarningText: 'Heads up about this book'};

        Cookies.set(`content-warning-${baseModel.id}`, 'true');
        render(<GTTinContext model={warned} />);

        await user.click(await screen.findByText('Download a PDF'));

        expect(screen.queryByText('Heads up about this book')).toBeNull();
        await screen.findByRole('link', {name: 'Go to your file'});
        Cookies.remove(`content-warning-${baseModel.id}`);
    });
    it('opens the dialog when localStorage cannot be read', async () => {
        const realStorage = window.localStorage;
        // Only the cap's own key throws: the language context reads storage
        // during render, so breaking every key never gets us to a click.
        const brokenStorage = {
            ...realStorage,
            getItem: (key: string) => {
                if (key === 'giveDialogLastDisplay') {
                    throw new Error('storage disabled');
                }
                return realStorage.getItem(key);
            },
            setItem: (key: string, value: string) => {
                if (key === 'giveDialogLastDisplay') {
                    throw new Error('storage disabled');
                }
                realStorage.setItem(key, value);
            },
            removeItem: (key: string) => realStorage.removeItem(key)
        };

        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            writable: true,
            value: brokenStorage
        });

        try {
            render(<GTTinContext />);
            await user.click(await screen.findByText('Download a PDF'));
            await screen.findByRole('link', {name: 'Go to your file'});
        } finally {
            Object.defineProperty(window, 'localStorage', {
                configurable: true,
                writable: true,
                value: realStorage
            });
        }
    });
    it('expands TOC option (Polish)', async () => {
        const mockIsPolish = jest.spyOn($, 'isPolish').mockReturnValue(true);

        render(<GTTinContext />);
        const toggleLink = await screen.findByRole('button', {
            name: 'Spis treści'
        });

        expect(toggleLink.getAttribute('aria-pressed')).toBe('false');
        await user.click(toggleLink);
        expect(toggleLink.getAttribute('aria-pressed')).toBe('true');
        mockIsPolish.mockReset();
    });
    it('excludes TOC option for retired books', async () => {
        const retiredModel = {
            ...baseModel,
            bookState: 'comingSoon',
            webviewRexLink: ''
        };

        render(<GTTinContext model={retiredModel} />);
        await screen.findByText('Download a PDF');
        expect(
            screen.queryAllByRole('button', {name: 'Table of contents'})
        ).toHaveLength(0);
    });
    it('shows PDF sample text for comingsoon books with PDF)', async () => {
        const comingSoonModel = {
            ...baseModel,
            bookState: 'comingSoon',
            comingSoon: true
        };

        render(<GTTinContext model={comingSoonModel} />);
        await screen.findByText('Download a PDF sample');
    });
    it('shows no PDF link when there is none', async () => {
        const noPdfModel = {
            ...baseModel,
            pdfUrl: null
        };

        render(<GTTinContext model={noPdfModel} />);
        await expect(screen.findByText('Download a PDF sample')).rejects.toThrow();
    });
});
