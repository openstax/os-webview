import React from 'react';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '../../../helpers/shell-context';
import MainMenu from '~/layouts/default/header/menus/main-menu/main-menu';
import MemoryRouter from '../../../helpers/future-memory-router';
import * as ULC from '~/contexts/language';
import * as PDU from '~/helpers/page-data-utils';
import type {NavNode} from '~/helpers/nav-nodes';

jest.mock('~/models/give-today', () => jest.fn().mockReturnValue({}));

function Component({path = '/'}) {
    return <ShellContextProvider>
        <MemoryRouter initialEntries={[path]}>
            <MainMenu />
        </MemoryRouter>
    </ShellContextProvider>;
}

afterEach(() => {
    jest.restoreAllMocks();
});

describe('main-menu', () => {
    it('renders only main-region nodes from oxmenus', () => {
        jest.spyOn(PDU, 'useDataFromSlug').mockReturnValue([
            {type: 'dropdown', region: 'main', name: 'About', menu: []},
            {type: 'link', region: 'utility', label: 'Blog', partial_url: '/blog'},
            {type: 'link', region: 'footer', label: 'Press', partial_url: '/press'}
        ] as NavNode[]);

        render(
            <ShellContextProvider>
                <MemoryRouter>
                    <MainMenu />
                </MemoryRouter>
            </ShellContextProvider>
        );

        expect(screen.getByText('About')).toBeTruthy();
        expect(screen.queryByText('Blog')).toBeNull();
        expect(screen.queryByText('Press')).toBeNull();
    });

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
