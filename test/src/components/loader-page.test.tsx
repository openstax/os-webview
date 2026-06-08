import React from 'react';
import {render, screen} from '@testing-library/preact';
import { LoadedPage } from '~/components/jsx-helpers/loader-page';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import * as DH from '~/helpers/use-document-head';
import { LayoutContextProvider } from '~/contexts/layout';

jest.spyOn(DH, 'default').mockReturnValue(undefined);

describe('loader-page', () => {
    // The rest of the code is exercised in other tests.
    it('loads 404 on data error', async () => {
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

        await screen.findByText('Uh-oh, no page here');
    });
});
