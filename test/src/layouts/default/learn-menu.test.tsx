import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import ShellContextProvider from '../../../helpers/shell-context';
import MemoryRouter from '../../../helpers/future-memory-router';
import {DropdownContextProvider} from '~/layouts/default/header/menus/dropdown-context';
import LearnMenu from '~/layouts/default/header/menus/main-menu/learn-menu/learn-menu';

function Component({path = '/'}) {
    return (
        <ShellContextProvider>
            <MemoryRouter initialEntries={[path]}>
                <DropdownContextProvider>
                    <ul>
                        <LearnMenu />
                    </ul>
                </DropdownContextProvider>
            </MemoryRouter>
        </ShellContextProvider>
    );
}

describe('learn-menu', () => {
    it('shows the library header, subjects, and extra links', async () => {
        const user = userEvent.setup();

        render(<Component />);
        await user.click(await screen.findByRole('button', {name: /Learn/}));

        // Header links to the full library
        const header = screen.getByRole('link', {name: /Visit the library/});

        expect(header.getAttribute('href')).toBe('/subjects');

        // Dynamic subjects present, but not the View All / K12 entries
        await screen.findByRole('link', {name: 'Math'});
        expect(screen.queryByRole('link', {name: 'View All'})).toBeNull();
        expect(screen.queryByRole('link', {name: 'K12'})).toBeNull();

        // Hardcoded extra links
        const print = screen.getByRole('link', {name: 'Order a print copy'});

        expect(print.getAttribute('href')).toBe('/print/');
        screen.getByRole('link', {name: 'Assignable'});
    });
});
