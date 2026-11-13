import React from 'react';
import {render, screen} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import GlobalReachLoader from '~/pages/global-reach/global-reach';

describe('global-reach page', () => {
    it('renders', async () => {
        render(
            <MemoryRouter initialEntries={['/global-reach']}>
                <ShellContextProvider>
                    <GlobalReachLoader />
                </ShellContextProvider>
            </MemoryRouter>
        );
        await screen.findByRole('heading', {level: 1});
    });
});
