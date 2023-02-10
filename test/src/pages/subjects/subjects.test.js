import React from 'react';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '../../../helpers/shell-context';
import {MemoryRouter} from 'react-router-dom';
import SubjectsRouter from '~/pages/subjects/new/subjects';

test('main subjects page', async () => {
    render(
        <ShellContextProvider>
            <MemoryRouter initialEntries={['']}>
                <SubjectsRouter />
            </MemoryRouter>
        </ShellContextProvider>
    );
    await screen.findByText('Browse our subjects');
    await screen.findByText('We have textbooks in', {exact: false});
    screen.getByText('View all Business books');
});
