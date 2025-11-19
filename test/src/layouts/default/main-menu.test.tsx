import React from 'react';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '../../../helpers/shell-context';
import MainMenu from '~/layouts/default/header/menus/main-menu/main-menu';
import MemoryRouter from '../../../helpers/future-memory-router';
import * as ULC from '~/contexts/language';

jest.mock('~/models/give-today', () => jest.fn().mockReturnValue({}));

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
