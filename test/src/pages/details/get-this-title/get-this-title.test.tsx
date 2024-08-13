import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import GetThisTitle from '~/pages/details/common/get-this-title';
import {TOCContextProvider} from '~/pages/details/common/toc-slideout/context';
import BookDetailsLoader from '../book-details-context';
// College algebra book details
import details from '../../../data/details-college-algebra';
import {transformData, camelCaseKeys} from '~/helpers/page-data-utils';

const model = camelCaseKeys(transformData(details));

function GTTinContext() {
    return (
        <BookDetailsLoader slug='books/college-algebra'>
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

const user = userEvent.setup();

describe('get-this-title', () => {
    it('renders with unexpanded options', async () => {
        render(<GTTinContext />);
        const expander = await screen.findByText('+ 1 more option...');

        await user.click(expander);
        await screen.findByText('See 1 fewer option');
        // Exercise link tracking
        await user.click(screen.getByText('Download for Kindle'));
    });
    it('opens give dialog for PDF', async () => {
        render(<GTTinContext />);
        const pdfLink = await screen.findByText('Download a PDF');

        await user.click(pdfLink);
        expect(screen.getAllByRole('dialog')).toHaveLength(2);
    });
    it('no dialog on mobile display', async () => {
        mockIsMobileDisplay.mockReturnValue(true);
        render(<GTTinContext />);
        const pdfLink = await screen.findByText('Download a PDF');

        await user.click(pdfLink);
        expect(screen.findByRole('dialog')).toBeTruthy();
    });
});
