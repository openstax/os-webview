import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {PaginatedResults, PaginatorControls} from '~/components/paginator/paginator.js';

function WrappedPaginator() {
    const [currentPage, setCurrentPage] = React.useState(2);
    const props = {
        items: 33,
        currentPage,
        setCurrentPage
    }

    return (
        <PaginatorControls {...props} />
    );
}

function activePage() {
    const activeButton = screen.getByRole('option', {selected: true});

    return activeButton.textContent;
}

test('operates by button clicks', () => {
    render(<WrappedPaginator />);
    userEvent.click(screen.getByText('Next'));
    expect(activePage()).toBe('3');
    userEvent.click(screen.getByText('4'));
    expect(activePage()).toBe('4');
    userEvent.click(screen.getByText('Previous'));
    expect(activePage()).toBe('3');
});
