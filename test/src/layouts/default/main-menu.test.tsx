import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import ShellContextProvider from '../../../helpers/shell-context';
import MainMenu from '~/layouts/default/header/menus/main-menu/main-menu';
import MemoryRouter from '../../../helpers/future-memory-router';
import {DropdownContextProvider} from '~/layouts/default/header/menus/dropdown-context';

jest.mock('~/models/give-today', () => jest.fn().mockReturnValue({}));

function Component({path = '/'}) {
    return <ShellContextProvider>
        <MemoryRouter initialEntries={[path]}>
            <DropdownContextProvider>
                <MainMenu />
            </DropdownContextProvider>
        </MemoryRouter>
    </ShellContextProvider>;
}

describe('main-menu', () => {
    it('renders a Learn toggle that reveals subjects', async () => {
        const user = userEvent.setup();

        render(<Component />);
        await user.click(await screen.findByRole('button', {name: /Learn/}));
        await screen.findByRole('link', {name: 'Math'});
        screen.getByRole('link', {name: /Visit the library/});
    });
    it('no longer shows a Subjects toggle', () => {
        render(<Component />);
        expect(screen.queryByRole('button', {name: /Subjects/})).toBeNull();
    });
});
