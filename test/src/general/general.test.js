import React from 'react';
import {render, screen} from '@testing-library/preact';
import {MemoryRouter} from 'react-router-dom';
import {RouterContextProvider} from '~/components/shell/router-context';
import GeneralPageLoader from '~/pages/general/general';

test(
    'renders kinetic page',
    async () => {
        render(
            <MemoryRouter initialEntries={['/general/kinetic']}>
                <RouterContextProvider>
                    <GeneralPageLoader />
                </RouterContextProvider>
            </MemoryRouter>
        );
        await screen.findByText(/Example activities/i);
    }
);