import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import RoleSelector from '~/components/role-selector/role-selector';
import MR from '~/../../test/helpers/future-memory-router';
import {LanguageContextProvider} from '~/contexts/language';

const user = userEvent.setup();

function Component() {
    return (
        <LanguageContextProvider>
            <MR>
                <RoleSelector value="Student" setValue={jest.fn()}>
                    <h1>Student stuff</h1>
                    <h1>Instructor stuff</h1>
                </RoleSelector>
            </MR>
        </LanguageContextProvider>
    );
}

describe('role-selector', () => {
    it('renders student content', async () => {
        render(<Component />);
        expect(
            (await screen.findByRole('heading', {level: 1})).textContent
        ).toBe('Student stuff');
    });
    it('does keyboard navigation through the list', async () => {
        render(<Component />);
        const activator = await screen.findByRole('combobox');

        await user.click(activator);

        // There are two listboxes, one for "Please select one" and the other for the options
        const listbox = screen.getAllByRole('listbox')[1];
        const options = screen.getAllByRole('option');

        expect(options).toHaveLength(8);
        listbox.focus();
        // The first character is to exercise the default case
        await user.keyboard('A{ArrowDown}{ArrowDown}');
        expect(options[1].getAttribute('aria-current')).toBe('true');
        await user.keyboard('{ArrowUp}');
        expect(options[0].getAttribute('aria-current')).toBe('true');
        expect(options[0].getAttribute('aria-selected')).toBe('false');
        await user.keyboard('{Enter}');
        expect(options[0].getAttribute('aria-selected')).toBe('true');
        await user.keyboard('{Escape}');
        // Select by space
        await user.keyboard('{ArrowDown} ');
        expect(options[1].getAttribute('aria-selected')).toBe('true');
        // fireEvent(options[0], new MouseEvent('mouseenter', {
        //     bubbles: true
        // }));
    });
});
