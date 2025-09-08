import React from 'react';
import {render, screen} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import GlobalReachLoader from '~/pages/global-reach/global-reach';

describe('global-reach page', () => {
    it('renders', async () => {
        render(
            <MemoryRouter initialEntries={['/global-reach']}>
                <GlobalReachLoader />
            </MemoryRouter>
        );
        await screen.findByRole('heading', {level: 1});
    });
});
