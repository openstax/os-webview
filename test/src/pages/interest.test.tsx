import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import InterestPage from '~/pages/interest/interest';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import {MainClassContextProvider} from '~/contexts/main-class';
import {SharedDataContextProvider} from '~/contexts/shared-data';
import {LanguageContextProvider} from '~/contexts/language';
import * as CI from '~/components/contact-info/contact-info';

jest.spyOn(CI, 'default').mockReturnValue(<h1>Contact info</h1>);

function Component() {
    return (
        <LanguageContextProvider>
            <SharedDataContextProvider>
                <MemoryRouter
                    initialEntries={[
                        '/details/books/college-algebra',
                        '/adoption'
                    ]}
                >
                    <MainClassContextProvider>
                        <InterestPage />
                    </MainClassContextProvider>
                </MemoryRouter>
            </SharedDataContextProvider>
        </LanguageContextProvider>
    );
}

const user = userEvent.setup();

describe('interest form', () => {
    it('renders', async () => {
        render(<Component />);
        const roleSelector = await screen.findByRole('combobox');

        console.info('*** RS:', roleSelector.outerHTML);
        await user.click(roleSelector);
        const options = screen.getAllByRole('option');

        await user.click(
            options.find((o) => o.textContent === 'Student') as Element
        );
        screen.findByText("Students don't need to fill out any forms", {
            exact: false
        });
        await user.click(
            options.find((o) => o.textContent === 'Other') as Element
        );
        await user.click(screen.getByRole('button', {name: 'Next'}));
        await user.click(screen.getByRole('button', {name: 'Submit'}));
        await user.click(
            (await screen.findAllByRole('checkbox', {name: 'Biology 2e'}))[0]
        );
        await user.type(screen.getByRole('spinbutton'), '12');

        // The value in here should update, but it doesn't work in Jest.
        // const bundledInput = () => document.querySelector('[name="how_did_you_hear"]') as HTMLInputElement;

        await user.click(screen.getByRole('checkbox', {name: 'Web search'}));
        await user.click(screen.getByRole('checkbox', {name: 'Email'}));
        await user.click(screen.getByRole('button', {name: 'Submit'}));
    });
});
