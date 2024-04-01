import React from 'react';
import {render, screen} from '@testing-library/preact';
import TeamLoader from '~/pages/team/team';
import {MemoryRouter} from 'react-router-dom';
import {it, expect} from '@jest/globals';

it('creates with a big chunk of data', async () => {
    render(
        <MemoryRouter>
            <TeamLoader />
        </MemoryRouter>
    );
    expect(await screen.findByRole('navigation'));
    expect(screen.queryAllByRole('heading').length).toBeGreaterThan(3);
});
