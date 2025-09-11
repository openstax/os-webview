import React from 'react';
import {render, screen, fireEvent} from '@testing-library/preact';
import {waitFor, within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import ErrataSummaryLoader from '~/pages/errata-summary/errata-summary';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import * as RC from '~/components/shell/router-context';

const searchStr = '/errata/?book=Anatomy%20and%20Physiology';

window.history.pushState('', '', searchStr);

// This is complicated by the fact that there are two versions that
// display at once, but one is hidden depending on screen resolution
// which testing knows nothing about.
// The desktop version is the last table; there are multiple tables
// (one for each row) in the mobile version
async function getTableRows() {
    const tables = await screen.findAllByRole('table');

    return within(tables.pop() as HTMLElement).getAllByRole('row');
}

describe('errata-summary', () => {
    const user = userEvent.setup({delay: null});

    it('shows all items in table', async () => {
        render(
            <MemoryRouter>
                <ErrataSummaryLoader />
            </MemoryRouter>
        );
        expect(await getTableRows()).toHaveLength(54);

        await user.click(screen.getByRole('button', {name: 'ID'}));
        expect(screen.getAllByRole('link').slice(-1)[0].textContent).toBe('7199');
        await user.click(screen.getByRole('button', {name: 'ID'}));
        expect(screen.getAllByRole('link').slice(-1)[0].textContent).toBe('2640');
        await user.click(screen.getByRole('button', {name: 'Error Type'}));
        expect(screen.getAllByRole('link').slice(-1)[0].textContent).toBe('2640');
        await user.click(screen.getByRole('button', {name: 'Error Type'}));
        expect(screen.getAllByRole('link').slice(-1)[0].textContent).toBe('3622');
        await user.click(screen.getByRole('button', {name: 'Decision'}));
        expect(screen.getAllByRole('link').slice(-1)[0].textContent).toBe('2640');
        await user.click(screen.getByRole('button', {name: 'Decision'}));
        expect(screen.getAllByRole('link').slice(-1)[0].textContent).toBe('7199');
    });
    it('filters', async () => {
        render(
            <MemoryRouter>
                <ErrataSummaryLoader />
            </MemoryRouter>
        );
        const reviewButton = await screen.findByRole('radio', {
            name: 'In Review'
        });

        await user.click(reviewButton);
        expect(await getTableRows()).toHaveLength(19);
        await user.click(screen.getByRole('radio', {name: 'Reviewed'}));
        expect(screen.getAllByRole('table')).toHaveLength(5);

        const allButton = screen.getByRole('radio', {name: 'View All'});

        // Ignores anything but space or enter
        fireEvent.keyDown(allButton, {key: 'a'});
        expect(screen.getAllByRole('table')).toHaveLength(5);

        // Acts on Enter
        fireEvent.keyDown(allButton, {key: 'Enter'});
        expect(screen.getAllByRole('table')).toHaveLength(54);
    });
    it('filters for Corrected', async () => {
        render(
            <MemoryRouter>
                <ErrataSummaryLoader />
            </MemoryRouter>
        );
        await user.click(await screen.findByRole('radio', {name: 'Corrected'}));
        expect(screen.getAllByRole('table')).toHaveLength(32);
    });
    it('handles mouseenter/leave over tooltip', async () => {
        render(
            <MemoryRouter>
                <ErrataSummaryLoader />
            </MemoryRouter>
        );

        const infoItem = () => document.querySelector('.with-tooltip') as HTMLElement;

        await waitFor(() => expect(infoItem()).not.toBeNull());
        infoItem().focus();
        await waitFor(() => expect(document.querySelector('.poptip[aria-hidden="false"')).toBeTruthy());
        infoItem().blur();
        await waitFor(() => expect(document.querySelector('.poptip[aria-hidden="true"')).toBeTruthy());
    });
    it('fails for unknown book', async () => {
        window.history.pushState('', '', '/errata/?book=Unknown%20Book');
        const fail = jest.fn();
        const mockUseContext = jest.spyOn(RC, 'default');

        mockUseContext.mockReturnValue({fail} as any); // eslint-disable-line

        render(
            <MemoryRouter>
                <ErrataSummaryLoader />
            </MemoryRouter>
        );
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(fail).toHaveBeenCalled();
        mockUseContext.mockReset();
    });
    it('aborts if not book or errata ID is selected', () => {
        window.history.pushState('', '', '/errata/');
        render(
            <MemoryRouter>
                <ErrataSummaryLoader />
            </MemoryRouter>
        );
        screen.getByText('No book or errata ID selected');
    });
});
