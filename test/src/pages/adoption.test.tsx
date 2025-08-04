import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import AdoptionForm from '~/pages/adoption/adoption';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import {MainClassContextProvider} from '~/contexts/main-class';
import {SharedDataContextProvider} from '~/contexts/shared-data';
import {LanguageContextProvider} from '~/contexts/language';
import * as CI from '~/components/contact-info/contact-info';
import HowUsing from '~/pages/adoption/how-using/how-using';
import { SalesforceBook } from '~/helpers/books';

jest.spyOn(CI, 'default').mockReturnValue(<h1>Contact info</h1>);

describe('adoption-form', () => {
    const saveWarn = console.warn;
    const user = userEvent.setup();

    beforeAll(() => {
        console.warn = jest.fn();
    });
    afterAll(() => {
        console.warn = saveWarn;
    });

    beforeEach(async () => {
        render(
            <LanguageContextProvider>
                <SharedDataContextProvider>
                    <MemoryRouter
                        initialEntries={['/details/books/college-algebra', '/adoption']}
                    >
                        <MainClassContextProvider>
                            <AdoptionForm />
                        </MainClassContextProvider>
                    </MemoryRouter>
                </SharedDataContextProvider>
            </LanguageContextProvider>
        );
        await screen.findByText(/Let us know you're using/);
    });

    it('no form appears when Student role is selected', async () => {
        const listBoxes = screen.queryAllByRole('listbox');

        await user.click(listBoxes[1]);
        const options = await screen.findAllByRole('option', {hidden: true});
        const studentOption = options.find(
            (o) => o.textContent === 'Student'
        );

        await user.click(studentOption as HTMLElement);
        expect(await screen.queryByRole('form')).toBeNull();
    });
    it('form appears when role is selected', async () => {
        const listBoxes = screen.queryAllByRole('listbox');

        await user.click(listBoxes[1]);
        const options = await screen.findAllByRole('option', {hidden: true});
        const instructorOption = options.find(
            (o) => o.textContent === 'Instructor'
        );

        await user.click(instructorOption as HTMLElement);
        screen.getByRole('form');
        // Contact info has been mocked
        await user.click(screen.getByRole('button', {name: 'Next'}));
        // Reject submission when no books checked
        await user.click(screen.getByRole('button', {name: 'Submit'}));
        await user.click((await screen.findAllByRole('checkbox', {name: 'Biology 2e'}))[0]);
        await user.type(screen.getByRole('spinbutton'), '12');
        await user.click(screen.getAllByRole('combobox').pop() as Element);
        await user.click(screen.getByRole('option', {name: 'As the core textbook for my course'}));
        console.error = jest.fn();
        // Submit and get navigation error
        await user.click(screen.getByRole('button', {name: 'Submit'}));
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining(
                'Not implemented: HTMLFormElement.prototype.submit'
            ),
            undefined
        );
    });
});
describe('how-using', () => {
    it('strips [Spanish] from book title', () => {
        const selectedBooks: SalesforceBook[] = [
            {
                text: 'Fisica universitaria volumen 1',
                value: 'University Physics [Spanish]',
                comingSoon: false,
                subjects: [],
                coverUrl: 'meh'
            }
        ];

        render(
            <LanguageContextProvider>
                <HowUsing selectedBooks={selectedBooks} />
            </LanguageContextProvider>
        );
        const jsonField = document.querySelector('[name="adoption_json"]') as HTMLInputElement;
        const value = JSON.parse(jsonField.value).Books[0];

        expect(value.name).toBe('University Physics');
    });
});
