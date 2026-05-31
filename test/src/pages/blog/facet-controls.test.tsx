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
