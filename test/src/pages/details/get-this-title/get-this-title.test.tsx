import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import GetThisTitle from '~/pages/details/common/get-this-title';
import {TOCContextProvider} from '~/pages/details/common/toc-slideout/context';
import BookDetailsLoader from '../book-details-context';
import * as UDH from '~/helpers/use-document-head';
import $ from '~/helpers/$';
import * as TL from '~/pages/details/common/track-link';
import * as UC from '~/contexts/user';
// College algebra book details
import details from '../../../data/details-college-algebra';
import {transformData, camelCaseKeys} from '~/helpers/page-data-utils';

const baseModel = camelCaseKeys(transformData(details));

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

    it('renders with unexpanded options', async () => {
        render(<GTTinContext />);
        const expander = await screen.findByText('+ 1 more option...');

        await user.click(expander);
        await screen.findByText('See 1 fewer option');
        // Exercise link tracking

        console.error = jest.fn();
        await user.click(screen.getByText('Download for Kindle'));
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('Not implemented: navigation'),
            undefined
        );
        console.error = originalError;
    });
    it('shows no expander if not needed', async () => {
        const noKindleModel = {...baseModel, kindleLink: ''};

        render(<GTTinContext model={noKindleModel} />);
        const links = await screen.findAllByRole('link');

        expect(links).toHaveLength(2);
        expect(
            links.find((el) => el.textContent?.includes('more option'))
        ).toBeUndefined();
    });
    it('opens give dialog for Webview', async () => {
        render(<GTTinContext />);
        const wvLink = await screen.findByText('View online');

        const closeRecommendedCallout = screen.getByRole('button', {
            name: 'close-popup'
        });

        await user.click(closeRecommendedCallout);

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
    it('shows iBooks options (2 volumes)', async () => {
        const ibooksModel = {
            ...baseModel,
            ibookLink: 'first-volume',
            ibookLink2: 'second-volume'
        };

        render(<GTTinContext model={ibooksModel} />);
        const expander = await screen.findByText('+ 2 more options...');

        await user.click(expander);
        screen.getByRole('link', {name: 'iBooks part 1'});
        screen.getByRole('link', {name: 'iBooks part 2'});
    });
});
