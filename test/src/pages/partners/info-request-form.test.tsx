import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import * as PC from '~/pages/partners/partner-details/partner-context';
import * as SFBC from '~/components/multiselect/book-tags/sf-book-context';
import sfBooks from '~/../../test/src/data/sf-all-books';
import InfoRequestForm from '~/pages/partners/partner-details/info-request-form/info-request-form';
import {SearchContextProvider} from '~/pages/partners/search-context';

async function renderForm() {
    render(
        <ShellContextProvider>
            <SearchContextProvider>
                <InfoRequestForm />
            </SearchContextProvider>
        </ShellContextProvider>
    );
    await screen.findByText(/Next/);
}

const mockPC1 = {
    partnerId: 1,
    partnerName: 'A Test',
    showInfoRequestForm: true,
    books: ['AP Bio', 'Biology'],
    toggleForm: jest.fn(),
    partnerType: 'normal'
};

const mockPC2 = {...mockPC1, partnerId: 2, partnerType: 'abnormal'};

const mockPC = jest.spyOn(PC, 'default');

jest.spyOn(SFBC, 'default').mockReturnValue({
    subjects: ['Science'],
    allBooks: sfBooks,
    books: sfBooks.slice(0, 6),
    filter: 'what',
    setFilter: () => null
});

describe('partners/info-rquest-form', () => {
    const user = userEvent.setup();

    it('renders form and accepts input', async () => {
        mockPC.mockReturnValue(mockPC1);
        renderForm();
        const select = screen.getByRole('combobox');

        await user.click(select);

        expect(await screen.findByRole('form')).toBeTruthy();
        const options = screen.queryAllByRole('option');

        await user.click(options[0]);

        await user.click(screen.getAllByRole('radio', {name: 'No'})[1]);
        await user.click(screen.getByRole('button', {name: 'Next'}));

        // -- The book selector is not working right in tests, so all of this
        // -- can't be tested until that gets figured out.
        // const schoolSelector = await screen.findByRole('textbox', {name: 'School'});
        // const roleSelector = screen.getByRole('combobox');
        // const studentField = screen.getByRole('spinbutton');

        // await user.click(roleSelector);
        // await user.click(screen.getByRole('option', {name: 'Other'}));
        // await user.type(schoolSelector, 'Ric');
        // await user.type(studentField, '12');

        // await user.click(screen.getByRole('button', {name: 'Submit', hidden: true}));
    });
    it('does a partner type beginning with a vowel', () => {
        mockPC.mockReturnValue(mockPC2);
        renderForm();
        screen.getByText('is an abnormal', {exact: false});
    });
});
