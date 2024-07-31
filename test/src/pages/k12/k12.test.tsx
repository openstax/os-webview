import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import {MemoryRouter} from 'react-router-dom';
import K12Router from '~/pages/k12/k12';

jest.mock('~/pages/k12/all-subjects/all-subjects.js', () =>
    jest.fn().mockReturnValue(<>All subjects</>)
);
jest.mock('~/pages/k12/subject/subject.js', () =>
    jest.fn().mockReturnValue(<>Specific subject</>)
);

describe('k12 page', () => {
    it('routes to all subjects with no path', async () => {
        render(
            <MemoryRouter initialEntries={['']}>
                <K12Router />
            </MemoryRouter>
        );
        await screen.findAllByText('All subjects');
    });
    it('routes to specific subject with path', async () => {
        render(
            <MemoryRouter initialEntries={['/math']}>
                <K12Router />
            </MemoryRouter>
        );
        await screen.findAllByText('Specific subject');
    });
});
