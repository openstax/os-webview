import React from 'react';
import {render, screen} from '@testing-library/preact';
import '@testing-library/jest-dom';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import LoginMenu from '~/layouts/default/header/menus/main-menu/login-menu/login-menu';
import * as UUC from '~/contexts/user';
import linkHelper from '~/helpers/link';

jest.mock('~/contexts/portal', () => ({
    __esModule: true,
    default: () => ({portalPrefix: ''})
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mockUserContext(value: any) {
    return jest.spyOn(UUC, 'default').mockReturnValue(value);
}

function renderMenu() {
    return render(
        <MemoryRouter initialEntries={['/']}>
            <ul><LoginMenu /></ul>
        </MemoryRouter>
    );
}

describe('LoginMenu', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders a plain login link when no one is logged in', () => {
        mockUserContext({});
        renderMenu();

        const link = screen.getByRole('link', {name: 'Log in'});

        expect(link.getAttribute('href')).toBe(linkHelper.loginLink());
        expect(screen.queryByText(/^Hi /)).toBeNull();
    });

    it('JIT-loads the dropdown once a logged-in userModel is available', async () => {
        mockUserContext({
            userModel: {id: 42, first_name: 'Roy', last_name: 'Johnson'}
        });
        renderMenu();

        expect(await screen.findByText('Hi Roy')).toBeInTheDocument();
        expect(screen.queryByRole('link', {name: 'Log in'})).toBeNull();
    });
});
