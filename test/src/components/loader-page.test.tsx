import React from 'react';
import {render, screen} from '@testing-library/preact';
import { LoadedPage } from '~/components/jsx-helpers/loader-page';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import { LayoutContextProvider } from '~/contexts/layout';

describe('loader-page', () => {
    // The rest of the code is exercised in other tests.
    it('loads 404 on data error', () => {
        const data = {
            error: true
        };
        const Child = () => <div>This should not render</div>;

        render(
            <MemoryRouter initialEntries={['/testpage']}>
                <LayoutContextProvider>
                    <LoadedPage data={data} Child={Child} props={{}} />
                </LayoutContextProvider>
            </MemoryRouter>
        );

        screen.findByText('Whoops');
    });
});
