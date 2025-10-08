import React from 'react';
import {render, screen} from '@testing-library/preact';
import { LoadedPage } from '~/components/jsx-helpers/loader-page';
import MemoryRouter from '~/../../test/helpers/future-memory-router';

describe('loader-page', () => {
    // The rest of the code is exercised in other tests.
    it('loads 404 on data error', () => {
        const data = {
            error: true
        };
        const Child = () => <div>This should not render</div>;

        render(
            <MemoryRouter initialEntries={['/testpage']}>
                <LoadedPage data={data} Child={Child} props={{}} />
            </MemoryRouter>
        );

        screen.findByText('Whoops');
    });
});
