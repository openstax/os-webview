import React from 'react';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '../../../helpers/shell-context';
import {MemoryRouter} from 'react-router-dom';
import {SubjectsContextProvider} from '~/pages/subjects/new/context';
import {SubjectsPage} from '~/pages/subjects/new/subjects';
import {test} from '@jest/globals';

test('main subjects page', async () => {
    render(
        <ShellContextProvider>
            <MemoryRouter initialEntries={['']}>
                <SubjectsContextProvider>
                    <SubjectsPage />
                </SubjectsContextProvider>
            </MemoryRouter>
        </ShellContextProvider>
    );
    await screen.findByText('Browse our subjects');
    await screen.findByText('We have textbooks in', {exact: false});
    await screen.findByText('View all Business books');
});
