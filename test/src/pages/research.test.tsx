import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import ResearchLoader from '~/pages/research/research';
import {Banner} from '~/pages/research/components/header';
import * as DH from '~/helpers/use-document-head';

const user = userEvent.setup();

const mockIsMobileDisplay = jest.fn().mockReturnValue(true);

jest.mock('~/helpers/device', () => ({
    ...jest.requireActual('~/helpers/device'),
    __esModule: true,
    isMobileDisplay: () => mockIsMobileDisplay()
}));
jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData').mockReturnValue();

describe('research page', () => {
    jest.setTimeout(18000);
    it('loads the data and page', async () => {
        render(
            <MemoryRouter>
                <ResearchLoader />
            </MemoryRouter>
        );
        const tablists = await screen.findAllByRole('tablist');

        expect(tablists).toHaveLength(2);

        // mobile display
        expect(screen.getAllByRole('link', {name: 'Pdf'})).toHaveLength(3);
        await user.click(screen.getByRole('button', {name: 'View All Publications'}));
        expect(screen.getAllByRole('link', {name: 'Pdf'})).toHaveLength(24);

        expect(document.querySelectorAll('#member-grid img')).toHaveLength(8);
        await user.click(screen.getAllByRole('button', {name: 'View All Current Members'})[0]);
        expect(document.querySelectorAll('#member-grid img')).toHaveLength(26);

        await user.click(screen.getAllByRole('button', {name: 'Rich'})[0]);
        screen.getByRole('dialog');
        ['Education', 'Research Interest', 'Bio'].forEach((name) => screen.getByRole('heading', {name}));
        await user.click(screen.getByRole('button', {name: 'close'}));
        // Katie has a specialization and no long title
        await user.click(screen.getAllByRole('button', {name: 'Katie'})[0]);
        screen.getByRole('dialog');
        await user.click(screen.getByRole('button', {name: 'close'}));
        // Nathan has no education or research interest
        await user.click(screen.getAllByRole('button', {name: 'Nathan'})[0]);
        screen.getByRole('dialog');
        ['Education', 'Research Interest'].forEach((name) =>
            expect(screen.queryByRole('heading', {name})).toBeNull()
        );
        await user.click(screen.getByRole('button', {name: 'close'}));

        await user.click(screen.getAllByRole('button', {name: 'View Less'})[1]);
        expect(document.querySelectorAll('#member-grid img')).toHaveLength(8);

        // desktop display
        mockIsMobileDisplay.mockReturnValue(false);
        await user.click(screen.getAllByRole('button', {name: 'View Less'})[0]);
        expect(screen.getAllByRole('link', {name: 'Pdf'})).toHaveLength(5);
    });
    it('suppresses Banner if bannerBody is empty', () => {
        const data = {
            bannerBody: '',
            bannerHeader: 'Something'
        };

        render(<Banner data={data} />);
        expect(document.body.textContent).toBe('');
    });
});

