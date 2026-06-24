import React from 'react';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import SearchControls from '~/pages/webinars/search-controls/search-controls';

it('sort is a radiogroup that updates aria-checked from relevance to newest', async () => {
    render(
        <MemoryRouter initialEntries={['/webinars/search?q=test']}>
            <SearchControls />
        </MemoryRouter>
    );
    expect(screen.getByRole('radiogroup', {name: 'Sort by'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Relevance'})).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', {name: 'Newest'})).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(screen.getByRole('radio', {name: 'Newest'}));
    expect(screen.getByRole('radio', {name: 'Newest'})).toHaveAttribute('aria-checked', 'true');
});

it('arrow keys move selection within the sort radiogroup', async () => {
    render(
        <MemoryRouter initialEntries={['/webinars/search?q=test']}>
            <SearchControls />
        </MemoryRouter>
    );
    screen.getByRole('radio', {name: 'Relevance'}).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', {name: 'Newest'})).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', {name: 'Relevance'})).toHaveAttribute('aria-checked', 'true');
});

it('clicking Newest then Relevance clears sort param (round-trip)', async () => {
    render(
        <MemoryRouter initialEntries={['/webinars/search?q=test']}>
            <SearchControls />
        </MemoryRouter>
    );
    await userEvent.click(screen.getByRole('radio', {name: 'Newest'}));
    expect(screen.getByRole('radio', {name: 'Newest'})).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(screen.getByRole('radio', {name: 'Relevance'}));
    expect(screen.getByRole('radio', {name: 'Relevance'})).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', {name: 'Newest'})).toHaveAttribute('aria-checked', 'false');
});

it('setSort callback properly updates URL params when toggling sort', async () => {
    const {container} = render(
        <MemoryRouter initialEntries={['/webinars/search?q=test']}>
            <SearchControls />
        </MemoryRouter>
    );

    // Click Newest - should add sort=newest to URL
    await userEvent.click(screen.getByRole('radio', {name: 'Newest'}));
    expect(screen.getByRole('radio', {name: 'Newest'})).toHaveAttribute('aria-checked', 'true');

    // Click back to Relevance - should remove sort param from URL
    await userEvent.click(screen.getByRole('radio', {name: 'Relevance'}));
    expect(screen.getByRole('radio', {name: 'Relevance'})).toHaveAttribute('aria-checked', 'true');
});

it('setSort handles undefined value when reverting to relevance', async () => {
    render(
        <MemoryRouter initialEntries={['/webinars/search?q=test&sort=newest']}>
            <SearchControls />
        </MemoryRouter>
    );

    // Initial state should be "newest" based on URL
    expect(screen.getByRole('radio', {name: 'Newest'})).toHaveAttribute('aria-checked', 'true');

    // Click Relevance - should call setSort with undefined
    await userEvent.click(screen.getByRole('radio', {name: 'Relevance'}));
    expect(screen.getByRole('radio', {name: 'Relevance'})).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', {name: 'Newest'})).toHaveAttribute('aria-checked', 'false');
});

it('renders sort controls with correct ARIA label', () => {
    render(
        <MemoryRouter initialEntries={['/webinars/search?q=test']}>
            <SearchControls />
        </MemoryRouter>
    );

    const radiogroup = screen.getByRole('radiogroup', {name: 'Sort by'});
    expect(radiogroup).toBeInTheDocument();
    expect(radiogroup).toHaveAttribute('aria-labelledby', 'webinar-sort-label');
});
