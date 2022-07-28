import React from 'react';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '../../../helpers/shell-context';
import {MemoryRouter} from 'react-router-dom';
import SubjectsRouter from '~/pages/subjects/new/subjects';

test('main subjects page', async () => {
    render(
        <ShellContextProvider>
            <MemoryRouter initialEntries={['/subjects']}>
                <SubjectsRouter />
            </MemoryRouter>
        </ShellContextProvider>
    );
    await screen.findByText('Browse our subjects');
    screen.getByText('We have textbooks in', {exact: false});
    screen.getByText('View all Business books');
});
