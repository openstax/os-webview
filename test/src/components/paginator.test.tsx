import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {PaginatorContextProvider} from '~/components/paginator/paginator-context';
import {PaginatorControls} from '~/components/paginator/search-results/paginator';
import SimplePaginator from '~/components/paginator/simple-paginator';

function activePage() {
    const activeButton = screen.getByRole('button', {current: 'page'});

    return activeButton.textContent;
}

describe('paginator', () => {
    const user = userEvent.setup();

    it('operates by button clicks', async () => {
        render(
            <PaginatorContextProvider contextValueParameters={{initialPage: 2}}>
                <PaginatorControls items={33} />
            </PaginatorContextProvider>
        );
        await user.click(screen.getByText('Next'));
        expect(activePage()).toBe('3');
        await user.click(screen.getByText('4'));
        expect(activePage()).toBe('4');
        await user.click(screen.getByText('Previous'));
        expect(activePage()).toBe('3');
    });
    it('does ellipses when beyond page 4', async () => {
        const setPage = jest.fn();

        render(
            <SimplePaginator
                currentPage={9}
                setPage={setPage}
                totalPages={10}
            />
        );

        screen.getByText('…', {exact: false});
        await user.click(screen.getByRole('link', {name: '10'}));
        expect(setPage).toHaveBeenCalledWith(10);
    });
});
