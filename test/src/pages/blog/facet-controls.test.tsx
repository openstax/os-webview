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

it('sort toggle updates aria-pressed from relevance to newest', async () => {
    render(
        <MemoryRouter initialEntries={['/blog/?q=x']}>
            <FacetControls subjects={subjects} collections={[]} />
        </MemoryRouter>
    );
    expect(screen.getByRole('button', {name: 'Relevance'})).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', {name: 'Newest'})).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(screen.getByRole('button', {name: 'Newest'}));
    expect(screen.getByRole('button', {name: 'Newest'})).toHaveAttribute('aria-pressed', 'true');
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
