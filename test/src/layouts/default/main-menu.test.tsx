import React from 'react';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '../../../helpers/shell-context';
import MainMenu from '~/layouts/default/header/menus/main-menu/main-menu';
import MemoryRouter from '../../../helpers/future-memory-router';
import * as ULC from '~/contexts/language';
import {useStreamlinedNav} from '~/contexts/shared-data';

jest.mock('~/models/give-today', () => jest.fn().mockReturnValue({}));

jest.mock('~/contexts/shared-data', () => {
    const actual = jest.requireActual('~/contexts/shared-data');

    return {__esModule: true, ...actual, useStreamlinedNav: jest.fn()};
});

function Component({path = '/'}) {
    return <ShellContextProvider>
        <MemoryRouter initialEntries={[path]}>
            <MainMenu />
        </MemoryRouter>
    </ShellContextProvider>;
}

describe('main-menu', () => {
    it('shows subjects menu when there are subjects', async () => {
        render(<Component />);

        await screen.findByRole('link', {name: 'Math'});
        screen.getByRole('link', {name: 'Spanish'});
        screen.getByRole('link', {name: '🍎 For K12 Teachers'});
    });
    it('hides language options in /details/books paths', async () => {
        render(<Component path='/details/books/a-book' />);

        await screen.findByRole('link', {name: 'Math'});
        expect(screen.queryByRole('link', {name: 'Spanish'})).toBeNull();
    });
    it('hides k12 item in Spanish', async () => {
        const spyLang = jest.spyOn(ULC, 'default').mockReturnValue({language: 'es', setLanguage: jest.fn()});

        render(<Component />);

        await screen.findByRole('link', {name: 'Math'});
        expect(screen.queryByRole('link', {name: '🍎 For K12 Teachers'})).toBeNull();
        spyLang.mockReset();
    });
});

describe('main-menu streamlined Give', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('renders a Give link before Log in when streamlined', async () => {
        (useStreamlinedNav as jest.Mock).mockReturnValue(true);
        render(<Component />);

        await screen.findByRole('link', {name: 'Math'});
        const give = screen.getByRole('link', {name: 'Give'});
        const login = screen.getByRole('link', {name: 'Log out'});

        expect(give).toBeTruthy();
        // Give appears before Log out in DOM order
        expect(
            give.compareDocumentPosition(login) & Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy();
    });

    it('does not render the persistent Give link when not streamlined', async () => {
        (useStreamlinedNav as jest.Mock).mockReturnValue(false);
        render(<Component />);

        await screen.findByRole('link', {name: 'Math'});
        // give-today mock returns {} (showButton falsy) so GiveButton renders null
        expect(screen.queryByRole('link', {name: 'Give'})).toBeNull();
    });
});
