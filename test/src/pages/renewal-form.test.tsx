import React from 'react';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '../../helpers/shell-context';
import {MemoryRouter} from 'react-router-dom';
import RenewalForm from '~/pages/renewal-form/renewal-form';

test(`renders navigator`, async () => {
    render(
        <ShellContextProvider>
            <MemoryRouter initialEntries={["/"]}>
                <RenewalForm />
            </MemoryRouter>
        </ShellContextProvider>
    );

    screen.getByText('logged in', {exact: false});
    await screen.findByRole('button');
});
