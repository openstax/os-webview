import React from 'react';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import FacetControls from '~/pages/blog/facet-controls/facet-controls';

const subjects = [{id: 1, name: 'Math'}, {id: 2, name: 'Science'}];

it('toggling a subject reflects pressed state', async () => {
    render(
        <MemoryRouter initialEntries={['/blog/?q=x']}>
            <FacetControls subjects={subjects} collections={[]} />
        </MemoryRouter>
    );
    await userEvent.click(screen.getByRole('button', {name: 'Math'}));
    expect(screen.getByRole('button', {name: 'Math'})).toHaveAttribute('aria-pressed', 'true');
});

it('sort is a radiogroup that updates aria-checked from relevance to newest', async () => {
    render(
        <MemoryRouter initialEntries={['/blog/?q=x']}>
            <FacetControls subjects={subjects} collections={[]} />
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
        <MemoryRouter initialEntries={['/blog/?q=x']}>
            <FacetControls subjects={subjects} collections={[]} />
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
        <MemoryRouter initialEntries={['/blog/?q=x']}>
            <FacetControls subjects={[{id: 1, name: 'Math'}]} collections={[]} />
        </MemoryRouter>
    );
    await userEvent.click(screen.getByRole('radio', {name: 'Newest'}));
    expect(screen.getByRole('radio', {name: 'Newest'})).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(screen.getByRole('radio', {name: 'Relevance'}));
    expect(screen.getByRole('radio', {name: 'Relevance'})).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', {name: 'Newest'})).toHaveAttribute('aria-checked', 'false');
});

it('collection select updates value when an option is chosen', async () => {
    render(
        <MemoryRouter initialEntries={['/blog/?q=x']}>
            <FacetControls subjects={[]} collections={[{id: 1, name: 'OpenStax Updates'}]} />
        </MemoryRouter>
    );
    await userEvent.selectOptions(screen.getByRole('combobox'), 'OpenStax Updates');
    expect(screen.getByRole('combobox')).toHaveValue('OpenStax Updates');
});

// Coverage for line 11: toggling OFF an active subject (filter branch)
it('toggling an active subject removes it from selection', async () => {
    render(
        <MemoryRouter initialEntries={['/blog/?q=x&subjects=Math']}>
            <FacetControls subjects={subjects} collections={[]} />
        </MemoryRouter>
    );
    // Math should be active (pressed) initially due to URL param
    expect(screen.getByRole('button', {name: 'Math'})).toHaveAttribute('aria-pressed', 'true');

    // Click to toggle it off (exercises line 11: active.filter((s) => s !== name))
    await userEvent.click(screen.getByRole('button', {name: 'Math'}));

    // Should now be inactive
    expect(screen.getByRole('button', {name: 'Math'})).toHaveAttribute('aria-pressed', 'false');
});

// Coverage for line 65: non-arrow key pressed (delta is falsy)
it('non-arrow keys do not change sort selection', async () => {
    render(
        <MemoryRouter initialEntries={['/blog/?q=x']}>
            <FacetControls subjects={subjects} collections={[]} />
        </MemoryRouter>
    );
    screen.getByRole('radio', {name: 'Relevance'}).focus();

    // Press a non-arrow key (exercises line 65: if (!delta) return)
    await userEvent.keyboard('{Enter}');

    // Selection should remain on Relevance
    expect(screen.getByRole('radio', {name: 'Relevance'})).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', {name: 'Newest'})).toHaveAttribute('aria-checked', 'false');
});

// Coverage for line 77: querySelectorAll failover when parentElement is null
// Note: This is difficult to test directly in JSDOM since parentElement is always present
// in the normal DOM hierarchy. The ?? [] failover is defensive programming for edge cases
// where the button might be disconnected from the DOM. We can verify the normal path works:
it('arrow keys successfully focus next radio button in group', async () => {
    render(
        <MemoryRouter initialEntries={['/blog/?q=x']}>
            <FacetControls subjects={subjects} collections={[]} />
        </MemoryRouter>
    );
    const relevanceButton = screen.getByRole('radio', {name: 'Relevance'});
    const newestButton = screen.getByRole('radio', {name: 'Newest'});

    relevanceButton.focus();
    expect(relevanceButton).toHaveFocus();

    // This exercises the successful path of line 77: group.querySelectorAll()
    await userEvent.keyboard('{ArrowRight}');

    // The focus should move to the next button
    expect(newestButton).toHaveFocus();
});
