import React from 'react';
import {render, screen} from '@testing-library/preact';
import {within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import ErrataSummaryLoader from '~/pages/errata-summary/errata-summary';
import Table from '~/pages/errata-summary/table/table';

const searchStr = '/errata/?book=Anatomy%20and%20Physiology';

window.history.pushState('', '', searchStr);

const getTableRows = () => screen.getAllByRole('row');
// This is complicated by the fact that there are two versions that
// display at once, but one is hidden depending on screen resolution
// which testing knows nothing about.
// The desktop version is the last table; there are multiple tables
// (one for each row) in the mobile version
test('shows all items in table', (done) => {
    render(<ErrataSummaryLoader />)
    setTimeout(() => {
        const table = screen.queryAllByRole('table').pop();

        expect(within(table).getAllByRole('row')).toHaveLength(54);
        done();
    }, 0);
});
test('filters', (done) => {
    render(<ErrataSummaryLoader />)
    setTimeout(() => {
        const filters = screen.queryByRole('radiogroup');

        userEvent.click(within(filters).queryByText('In Review'));
        const table = screen.queryAllByRole('table').pop();

        expect(within(table).getAllByRole('row')).toHaveLength(19);
        done();
    }, 0);

});
