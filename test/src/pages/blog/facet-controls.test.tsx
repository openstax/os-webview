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
