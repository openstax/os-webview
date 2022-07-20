import React from 'react';
import {render, screen} from '@testing-library/preact';
import TeamLoader from '~/pages/team/team';

it('creates with a big chunk of data', async () => {
    render(<TeamLoader />);
    expect(await screen.findByRole('navigation'));
    expect(screen.queryAllByRole('heading').length).toBeGreaterThan(3);
});
