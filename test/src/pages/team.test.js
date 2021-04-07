import React from 'react';
import {render, screen} from '@testing-library/preact';
import TeamLoader from '~/pages/team/team';

it('creates with a big chunk of data', (done) => {
    render(<TeamLoader />);
    setTimeout(() => {
        expect(screen.getByRole('navigation'));
        expect(screen.queryAllByRole('heading').length).toBeGreaterThan(3);
        done();
    }, 0);
});
