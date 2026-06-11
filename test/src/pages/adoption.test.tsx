import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import AdoptionForm from '~/pages/adoption/adoption';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import {MainClassContextProvider} from '~/contexts/main-class';
import {SharedDataContextProvider} from '~/contexts/shared-data';
import {LanguageContextProvider} from '~/contexts/language';
import {UserContextProvider} from '~/contexts/user';
import * as UM from '~/models/usermodel';
import * as CI from '~/components/contact-info/contact-info';
import HowUsing from '~/pages/adoption/how-using/how-using';
import {SalesforceBook} from '~/helpers/books';
import userModel from '~/../../test/src/data/userModel';

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
                        initialEntries={[
                            '/details/books/college-algebra',
                            '/adoption'
                        ]}
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
        const studentOption = options.find((o) => o.textContent === 'Student');

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
        // Search to expand the subject section containing Biology
        await user.type(screen.getByRole('searchbox'), 'Biology');
        await user.click(
            (await screen.findAllByRole('checkbox', {name: 'Biology 2e'}))[0]
        );
        await user.type(screen.getByRole('spinbutton'), '12');
        await user.click(screen.getAllByRole('combobox').pop() as Element);
        await user.click(
            screen.getByRole('option', {
                name: 'As the core textbook for my course'
            })
        );
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
describe('adoption-form logged-in flow', () => {
    const user = userEvent.setup();

    beforeAll(() => {
        jest.spyOn(UM, 'useUserModel').mockReturnValue(
            userModel as unknown as UM.UserModelType
        );
    });

    afterAll(() => {
        jest.restoreAllMocks();
        jest.spyOn(CI, 'default').mockReturnValue(<h1>Contact info</h1>);
    });

    it('renders CMS header and single-page form', async () => {
        render(
            <LanguageContextProvider>
                <SharedDataContextProvider>
                    <UserContextProvider>
                        <MemoryRouter
                            initialEntries={[
                                '/details/books/college-algebra',
                                '/adoption'
                            ]}
                        >
                            <MainClassContextProvider>
                                <AdoptionForm />
                            </MainClassContextProvider>
                        </MemoryRouter>
                    </UserContextProvider>
                </SharedDataContextProvider>
            </LanguageContextProvider>
        );

        // CMS-driven header
        await screen.findByText(/Let us know you're using/);

        // No role selector in logged-in flow
        expect(screen.queryAllByRole('listbox')).toHaveLength(0);

        // Form is immediately visible (no role selection needed)
        screen.getByRole('form');

        // Year checkboxes are visible
        screen.getByText(/Which school year/);

        // Hidden contact fields are populated from user model
        const hiddenFirst = document.querySelector(
            'input[name="first_name"]'
        ) as HTMLInputElement;
        expect(hiddenFirst.value).toBe('Roy');

        const hiddenLast = document.querySelector(
            'input[name="last_name"]'
        ) as HTMLInputElement;
        expect(hiddenLast.value).toBe('Johnson');

        const hiddenEmail = document.querySelector(
            'input[name="email"]'
        ) as HTMLInputElement;
        expect(hiddenEmail.value).toBe('rej2+verify.1@rice.edu');

        // Search to expand the subject section containing Biology
        await user.type(screen.getByRole('searchbox'), 'Biology');
        await user.click(
            (await screen.findAllByRole('checkbox', {name: 'Biology 2e'}))[0]
        );
        await user.type(screen.getByRole('spinbutton'), '12');
        await user.click(screen.getAllByRole('combobox').pop() as Element);
        await user.click(
            screen.getByRole('option', {
                name: 'As the core textbook for my course'
            })
        );

        console.error = jest.fn();
        await user.click(screen.getByRole('button', {name: 'Submit'}));
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining(
                'Not implemented: HTMLFormElement.prototype.submit'
            ),
            undefined
        );
    });
});
describe('adoption-form year selection', () => {
    const user = userEvent.setup();

    beforeAll(() => {
        jest.spyOn(UM, 'useUserModel').mockReturnValue(
            userModel as unknown as UM.UserModelType
        );
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('allows toggling year checkboxes on and off', async () => {
        render(
            <LanguageContextProvider>
                <SharedDataContextProvider>
                    <UserContextProvider>
                        <MemoryRouter
                            initialEntries={[
                                '/details/books/college-algebra',
                                '/adoption'
                            ]}
                        >
                            <MainClassContextProvider>
                                <AdoptionForm />
                            </MainClassContextProvider>
                        </MemoryRouter>
                    </UserContextProvider>
                </SharedDataContextProvider>
            </LanguageContextProvider>
        );

        await screen.findByText(/Which school year/);

        // Find all year checkboxes
        const yearCheckboxes = screen.getAllByRole('checkbox').filter(
            (cb) => {
                const label = cb.closest('label');
                return label?.textContent?.match(/\d{4}–\d{4}/);
            }
        );

        // One should be checked by default (current academic year)
        const checkedBoxes = yearCheckboxes.filter((cb: HTMLInputElement) => cb.checked);
        expect(checkedBoxes.length).toBe(1);

        // Toggle the first year checkbox off
        await user.click(yearCheckboxes[0]);

        // Verify it was unchecked
        expect((yearCheckboxes[0] as HTMLInputElement).checked).toBe(false);

        // Toggle it back on
        await user.click(yearCheckboxes[0]);

        // Verify it was checked again
        expect((yearCheckboxes[0] as HTMLInputElement).checked).toBe(true);
    });

    it('allows selecting multiple years', async () => {
        render(
            <LanguageContextProvider>
                <SharedDataContextProvider>
                    <UserContextProvider>
                        <MemoryRouter
                            initialEntries={[
                                '/details/books/college-algebra',
                                '/adoption'
                            ]}
                        >
                            <MainClassContextProvider>
                                <AdoptionForm />
                            </MainClassContextProvider>
                        </MemoryRouter>
                    </UserContextProvider>
                </SharedDataContextProvider>
            </LanguageContextProvider>
        );

        await screen.findByText(/Which school year/);

        const yearCheckboxes = screen.getAllByRole('checkbox').filter(
            (cb) => {
                const label = cb.closest('label');
                return label?.textContent?.match(/\d{4}–\d{4}/);
            }
        );

        // Check all three year checkboxes
        for (const checkbox of yearCheckboxes) {
            if (!(checkbox as HTMLInputElement).checked) {
                await user.click(checkbox);
            }
        }

        // Verify all are checked
        const allChecked = yearCheckboxes.every((cb: HTMLInputElement) => cb.checked);
        expect(allChecked).toBe(true);
    });
});

describe('adoption-form with renewals data', () => {
    const user = userEvent.setup();
    const mockAdoptions = {
        Books: [
            {name: 'Biology 2e', students: 50},
            {name: 'Chemistry 2e', students: 30}
        ]
    };

    beforeAll(() => {
        jest.spyOn(UM, 'useUserModel').mockReturnValue(
            userModel as unknown as UM.UserModelType
        );
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('preselects books from adoptions data and populates initial counts', async () => {
        // Mock useAdoptions to return data
        const useAdoptions = require('~/models/renewals').default;
        jest.spyOn(require('~/models/renewals'), 'default').mockReturnValue(mockAdoptions);

        render(
            <LanguageContextProvider>
                <SharedDataContextProvider>
                    <UserContextProvider>
                        <MemoryRouter
                            initialEntries={[
                                '/details/books/college-algebra',
                                '/adoption'
                            ]}
                        >
                            <MainClassContextProvider>
                                <AdoptionForm />
                            </MainClassContextProvider>
                        </MemoryRouter>
                    </UserContextProvider>
                </SharedDataContextProvider>
            </LanguageContextProvider>
        );

        await screen.findByText(/Let us know you're using/);

        // Search for Biology to expand the section
        await user.type(screen.getByRole('searchbox'), 'Biology');

        // Biology 2e should be pre-checked
        const biologyCheckbox = (await screen.findAllByRole('checkbox', {name: 'Biology 2e'}))[0];
        expect((biologyCheckbox as HTMLInputElement).checked).toBe(true);

        // The student count input should have the initial value from adoptions
        const spinbuttons = screen.getAllByRole('spinbutton');
        const biologyCountInput = spinbuttons.find((input: HTMLInputElement) =>
            input.value === '50'
        );
        expect(biologyCountInput).toBeTruthy();
    });

    it('handles adoptions data with empty books array', async () => {
        jest.spyOn(require('~/models/renewals'), 'default').mockReturnValue({
            Books: []
        });

        render(
            <LanguageContextProvider>
                <SharedDataContextProvider>
                    <UserContextProvider>
                        <MemoryRouter
                            initialEntries={[
                                '/details/books/college-algebra',
                                '/adoption'
                            ]}
                        >
                            <MainClassContextProvider>
                                <AdoptionForm />
                            </MainClassContextProvider>
                        </MemoryRouter>
                    </UserContextProvider>
                </SharedDataContextProvider>
            </LanguageContextProvider>
        );

        await screen.findByText(/Let us know you're using/);

        // Form should render without errors
        screen.getByRole('form');
    });
});

describe('adoption-form with URL parameters', () => {
    const user = userEvent.setup();

    beforeAll(() => {
        jest.spyOn(UM, 'useUserModel').mockReturnValue(
            userModel as unknown as UM.UserModelType
        );
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('preselects year from URL query parameter', async () => {
        const now = new Date();
        const defaultStartYear = now.getFullYear() - (now.getMonth() < 6 ? 2 : 1);
        const testYear = defaultStartYear.toString();

        render(
            <LanguageContextProvider>
                <SharedDataContextProvider>
                    <UserContextProvider>
                        <MemoryRouter
                            initialEntries={[
                                '/details/books/college-algebra',
                                `/adoption?year=${testYear}`
                            ]}
                        >
                            <MainClassContextProvider>
                                <AdoptionForm />
                            </MainClassContextProvider>
                        </MemoryRouter>
                    </UserContextProvider>
                </SharedDataContextProvider>
            </LanguageContextProvider>
        );

        await screen.findByText(/Which school year/);

        const yearCheckboxes = screen.getAllByRole('checkbox').filter(
            (cb) => {
                const label = cb.closest('label');
                return label?.textContent?.includes(`${testYear}–`);
            }
        );

        // The year from URL should be checked
        expect((yearCheckboxes[0] as HTMLInputElement).checked).toBe(true);
    });
});

describe('adoption-form with different roles', () => {
    const user = userEvent.setup();

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('maps administrator role to Administrator position', async () => {
        const adminUserModel = {
            ...userModel,
            self_reported_role: 'administrator'
        };

        jest.spyOn(UM, 'useUserModel').mockReturnValue(
            adminUserModel as unknown as UM.UserModelType
        );

        render(
            <LanguageContextProvider>
                <SharedDataContextProvider>
                    <UserContextProvider>
                        <MemoryRouter
                            initialEntries={[
                                '/details/books/college-algebra',
                                '/adoption'
                            ]}
                        >
                            <MainClassContextProvider>
                                <AdoptionForm />
                            </MainClassContextProvider>
                        </MemoryRouter>
                    </UserContextProvider>
                </SharedDataContextProvider>
            </LanguageContextProvider>
        );

        await screen.findByText(/Let us know you're using/);

        // Check that position hidden field has the correct value
        const positionField = document.querySelector(
            'input[name="position"]'
        ) as HTMLInputElement;
        expect(positionField.value).toBe('Administrator');
    });

    it('maps librarian role to Librarian position', async () => {
        const librarianUserModel = {
            ...userModel,
            self_reported_role: 'librarian'
        };

        jest.spyOn(UM, 'useUserModel').mockReturnValue(
            librarianUserModel as unknown as UM.UserModelType
        );

        render(
            <LanguageContextProvider>
                <SharedDataContextProvider>
                    <UserContextProvider>
                        <MemoryRouter
                            initialEntries={[
                                '/details/books/college-algebra',
                                '/adoption'
                            ]}
                        >
                            <MainClassContextProvider>
                                <AdoptionForm />
                            </MainClassContextProvider>
                        </MemoryRouter>
                    </UserContextProvider>
                </SharedDataContextProvider>
            </LanguageContextProvider>
        );

        await screen.findByText(/Let us know you're using/);

        const positionField = document.querySelector(
            'input[name="position"]'
        ) as HTMLInputElement;
        expect(positionField.value).toBe('Librarian');
    });

    it('maps unknown role to Other position', async () => {
        const unknownRoleUserModel = {
            ...userModel,
            self_reported_role: 'unknown_role'
        };

        jest.spyOn(UM, 'useUserModel').mockReturnValue(
            unknownRoleUserModel as unknown as UM.UserModelType
        );

        render(
            <LanguageContextProvider>
                <SharedDataContextProvider>
                    <UserContextProvider>
                        <MemoryRouter
                            initialEntries={[
                                '/details/books/college-algebra',
                                '/adoption'
                            ]}
                        >
                            <MainClassContextProvider>
                                <AdoptionForm />
                            </MainClassContextProvider>
                        </MemoryRouter>
                    </UserContextProvider>
                </SharedDataContextProvider>
            </LanguageContextProvider>
        );

        await screen.findByText(/Let us know you're using/);

        const positionField = document.querySelector(
            'input[name="position"]'
        ) as HTMLInputElement;
        expect(positionField.value).toBe('Other');
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
                <HowUsing selectedBooks={selectedBooks} years={['2025']} />
            </LanguageContextProvider>
        );
        const jsonField = document.querySelector(
            '[name="adoption_json"]'
        ) as HTMLInputElement;
        const value = JSON.parse(jsonField.value).Books[0];

        expect(value.name).toBe('University Physics');
    });
});
