import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import AdoptionForm from '~/pages/adoption/adoption';
import {MemoryRouter} from 'react-router-dom';
import {MainClassContextProvider} from '~/contexts/main-class';
import {SharedDataContextProvider} from '~/contexts/shared-data';

beforeEach(async () => {
    render(
        <SharedDataContextProvider>
            <MemoryRouter
                initialEntries={['/details/books/college-algebra', '/adoption']}
            >
                <MainClassContextProvider>
                    <AdoptionForm />
                </MainClassContextProvider>
            </MemoryRouter>
        </SharedDataContextProvider>
    );
    await screen.findByText(/Let us know you're using/);
});

test('creates with role selector', () =>
    expect(screen.queryAllByRole('option', {hidden: true})).toHaveLength(8));

/* This test works locally, but not on checkin
 * Moreover, the form it finds is just the one around the role selector
 */
// test(
//     'form appears when role is selected',
//     async () => {
//         const listBox = screen.queryByRole('listbox');
//         const user = userEvent.setup();

//         await user.click(listBox);
//         const options = await screen.findAllByRole('option', {hidden: true});
//         const instructorOption = options.find((o) => o.textContent === 'Instructor');
//         await user.click(instructorOption);
//         await screen.findByRole('form');
//     }
// )
