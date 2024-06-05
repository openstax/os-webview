import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {PaginatorContextProvider} from '~/components/paginator/paginator-context';
import {PaginatorControls} from '~/components/paginator/search-results/paginator.js';
import {test, expect} from '@jest/globals';

function activePage() {
    const activeButton = screen.getByRole('button', {current: 'page'});

    return activeButton.textContent;
}

test('operates by button clicks', async () => {
    const user = userEvent.setup();

    render(
        <PaginatorContextProvider contextValueParameters={{initialPage: 2}}>
            <PaginatorControls items="33" />
        </PaginatorContextProvider>
    );
    await user.click(screen.getByText('Next'));
    expect(activePage()).toBe('3');
    await user.click(screen.getByText('4'));
    expect(activePage()).toBe('4');
    await user.click(screen.getByText('Previous'));
    expect(activePage()).toBe('3');
});
