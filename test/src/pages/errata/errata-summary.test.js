import React from 'react';
import {render, screen} from '@testing-library/preact';
import {within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import ErrataSummaryLoader from '~/pages/errata-summary/errata-summary';
import Table from '~/pages/errata-summary/table/table';

const searchStr = '/errata/?book=Anatomy%20and%20Physiology';

window.history.pushState('', '', searchStr);

// This is complicated by the fact that there are two versions that
// display at once, but one is hidden depending on screen resolution
// which testing knows nothing about.
// The desktop version is the last table; there are multiple tables
// (one for each row) in the mobile version
async function getTableRows() {
    const tables = await screen.findAllByRole('table');

    return within(tables.pop()).getAllByRole('row');
}

test('shows all items in table', async () => {
    render(<ErrataSummaryLoader />)
    expect(await getTableRows()).toHaveLength(54);
});
test('filters', async () => {
    render(<ErrataSummaryLoader />)
    const filters = await screen.findByRole('radiogroup');
    const user = userEvent.setup();

    await user.click(within(filters).queryByText('In Review'));
    expect(await getTableRows()).toHaveLength(19);
});
