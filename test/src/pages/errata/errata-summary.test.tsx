import React from 'react';
import {render, screen, fireEvent} from '@testing-library/preact';
import {within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import ErrataSummaryLoader from '~/pages/errata-summary/errata-summary';
import {MemoryRouter} from 'react-router-dom';

// @ts-expect-error does not exist on
const {routerFuture} = global;

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
    test('shows all items in table', async () => {
        render(
            <MemoryRouter future={routerFuture}>
                <ErrataSummaryLoader />
            </MemoryRouter>
        );
        expect(await getTableRows()).toHaveLength(54);
    });
    test('filters', async () => {
        render(
            <MemoryRouter future={routerFuture}>
                <ErrataSummaryLoader />
            </MemoryRouter>
        );
        const user = userEvent.setup({delay: null});
        const reviewButton = await screen.findByRole('radio', {
            name: 'In Review'
        });

        await user.click(reviewButton);
        expect(await getTableRows()).toHaveLength(19);
        const allButton = screen.getByRole('radio', {name: 'View All'});

        expect(screen.getAllByRole('table')).toHaveLength(19);
        // Ignores anything but space or enter
        fireEvent.keyDown(allButton, {key: 'a'});
        expect(screen.getAllByRole('table')).toHaveLength(19);

        // Acts on Enter
        fireEvent.keyDown(allButton, {key: 'Enter'});
        expect(screen.getAllByRole('table')).toHaveLength(54);
    });
});
