import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import AdoptionForm from '~/pages/adoption/adoption';
import FormHeader from '~/components/form-header/form-header';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import {MainClassContextProvider} from '~/contexts/main-class';
import {SharedDataContextProvider} from '~/contexts/shared-data';
import {LanguageContextProvider} from '~/contexts/language';
import usePortalContext, {PortalContextProvider} from '~/contexts/portal';

describe('adoption-form', () => {
    const saveWarn = console.warn;

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

    it('creates with role selector', () =>
        expect(screen.queryAllByRole('option', {hidden: true})).toHaveLength(8));

    it('form appears when role is selected', async () => {
        const listBoxes = screen.queryAllByRole('listbox');
        const user = userEvent.setup();

        await user.click(listBoxes[1]);
        const options = await screen.findAllByRole('option', {hidden: true});
        const instructorOption = options.find(
            (o) => o.textContent === 'Instructor'
        );

        await user.click(instructorOption as HTMLElement);
        await screen.findByRole('form');
    });
});

describe('form-header in portal', () => {
    function Component() {
        const {setPortal} = usePortalContext();

        setPortal('some-portal');

        return <FormHeader prefix="adoption" />;
    }

    it('rewrites links', async () => {
        render(
            <LanguageContextProvider>
                <MemoryRouter initialEntries={['/some-portal/adoption']}>
                    <PortalContextProvider>
                        <Component />
                    </PortalContextProvider>
                </MemoryRouter>
            </LanguageContextProvider>
        );
        const link = await screen.findByRole('link');

        expect(link.getAttribute('href')).toBe('/some-portal/interest');
    });
});
