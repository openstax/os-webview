import React from 'react';
import {fireEvent, render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import ShellContextProvider from '../../helpers/shell-context';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import RenewalForm from '~/pages/renewal-form/renewal-form';
import * as UUC from '~/contexts/user';
import * as UA from '~/models/renewals';
import userModel from '../data/userModel';
import userStatus from '../data/userStatus';
import allBooks from '../data/sf-all-books';
import * as SFBC from '~/components/multiselect/book-tags/sf-book-context';

const mockNavigate = jest.fn();
// option necessary when using fake timers
const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});

const userContextDefault = {
    userModel,
    userStatus
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

jest.useFakeTimers();
describe('renewal-form', () => {
    function Component({path = '/'}) {
        return (
            <ShellContextProvider>
                <MemoryRouter initialEntries={[path]}>
                    <RenewalForm />
                </MemoryRouter>
            </ShellContextProvider>
        );
    }
    beforeAll(() => {
        console.debug = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('requires login', () => {
        jest.spyOn(UUC, 'default').mockReturnValue({
            // @ts-expect-error missing properties
            userStatus: {}
        });
        render(<Component />);

        screen.getByText('You need to be logged in', {exact: false});
        jest.runAllTimers();
    });
    it('shows form when uuid received', () => {
        // @ts-expect-error missing properties
        jest.spyOn(UUC, 'default').mockReturnValue(userContextDefault);
        render(<Component />);
        screen.getByRole('button');
    });
    it('initializes with existing adoptions', async () => {
        // @ts-expect-error missing properties
        jest.spyOn(UUC, 'default').mockReturnValue(userContextDefault);
        jest.spyOn(UA, 'default').mockReturnValue({
            Books: [{name: 'Biology', students: 12}]
        });
        render(<Component path="/?returnTo=some-page" />);
        screen.getByText('What books are you using?');

        const input = await screen.findByRole('spinbutton');

        await user.type(input, '{selectall}10');
        expect(
            document.querySelector<HTMLInputElement>('[name="success_location"')
                ?.value
        ).toBe('some-page');

        // Filter results
        const filterInput = screen.getByRole('textbox');

        await user.click(filterInput);
        await user.type(filterInput, 'math');

        expect(screen.getAllByRole('option')).toHaveLength(6);

        // Remove an adoption
        const remove = screen.getByRole('button', {name: 'remove'});

        await user.click(remove);
        expect(screen.queryByRole('spinbutton')).toBeNull();

        // Operate BookOption by key
        const options = screen.getAllByRole('option');

        expect(options).toHaveLength(6);
        options[0].focus();
        // Select book
        fireEvent.keyDown(options[0], {key: ' '});
        // Deselect book
        fireEvent.keyDown(options[0], {key: ' '});
        // Toggle book section
        fireEvent.keyDown(options[0], {key: 'Escape'});
    });
    it('handles missing adoptions', async () => {
        // @ts-expect-error missing properties
        jest.spyOn(UUC, 'default').mockReturnValue(userContextDefault);
        jest.spyOn(UA, 'default').mockReturnValue(undefined);
        const sfContext = {
            subjects: ['Business', 'Math'],
            allBooks,
            books: [],
            filter: '',
            setFilter: jest.fn()
        };

        jest.spyOn(SFBC, 'default').mockReturnValue(sfContext);
        render(<Component />);
        screen.getByText('...fetching adoption info...');
    });
});
