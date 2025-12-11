import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import * as PC from '~/pages/partners/partner-details/partner-context';
import * as SFBC from '~/components/multiselect/book-tags/sf-book-context';
import sfBooks from '~/../../test/src/data/sf-all-books';
import InfoRequestForm from '~/pages/partners/partner-details/info-request-form/info-request-form';
import {SearchContextProvider} from '~/pages/partners/search-context';
import {
    useAcceptValue,
    useSetValueFromTarget,
    useDoSubmit
} from '~/pages/partners/partner-details/info-request-form/school-selector';

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
        // Going past the first page is unreliable in testing, so the pieces
        // are tested separately
    });
    it('does a partner type beginning with a vowel', () => {
        mockPC.mockReturnValue(mockPC2);
        renderForm();
        screen.getByText('is an abnormal', {exact: false});
    });
});

describe('school-selector utilities', () => {
    it('useAcceptValue sets a value', () => {
        const setValue = jest.fn();

        function Component() {
            const accept = useAcceptValue(setValue);

            accept({value: 'a value'});
            return null;
        }

        render(<Component />);
        expect(setValue).toHaveBeenCalledWith('a value');
    });
    it('useSetValueFromTarget sets a value', () => {
        const setValue = jest.fn();

        function Component() {
            const accept = useSetValueFromTarget(setValue);

            accept({target: {value: 'a value'}} as unknown as React.ChangeEvent<HTMLInputElement>);
            return null;
        }

        render(<Component />);
        expect(setValue).toHaveBeenCalledWith('a value');
    });
    it('useDoSubmit calls form.submit and afterSubmit', () => {
        const form = {submit: jest.fn()} as unknown as HTMLFormElement;
        const afterSubmit = jest.fn();

        function Component() {
            const doSubmit = useDoSubmit(afterSubmit);

            doSubmit(form);

            return null;
        }

        render(<Component />);
        expect(form.submit).toHaveBeenCalled();
        expect(afterSubmit).toHaveBeenCalled();
    });
});
