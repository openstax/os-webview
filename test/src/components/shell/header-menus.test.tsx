import React from 'react';
import {describe, it, expect} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import Menus from '~/layouts/default/header/menus/menus';
import {MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import useGiveToday from '~/models/give-today';

global.fetch = jest.fn().mockImplementation(() => {
    return Promise.resolve({
        json() {
            return [];
        }
    });
});

jest.mock('~/models/give-today', () => jest.fn());

describe('shell/header/menus', () => {
    const user = userEvent.setup();

    it('renders', async () => {
        (useGiveToday as jest.Mock).mockReturnValue({
            showButton: true
        });
        render(
            <MemoryRouter initialEntries={['/']}>
                <Menus />
            </MemoryRouter>
        );
        expect(screen.getAllByRole('listitem')).toHaveLength(16);
        const button = screen.getByRole('button');

        expect(screen.getAllByRole('menuitem')).toHaveLength(2);
        await user.click(button);
        button.focus();
        expect(document.activeElement).toBe(button);
        expect(button.parentElement?.classList.contains('active')).toBe(true);
        await user.keyboard('{Escape}');
        expect(button.parentElement?.classList.contains('active')).toBe(false);
        // If clicked when not active, it does nothing
        await user.keyboard('{Escape}');
        expect(button.parentElement?.classList.contains('active')).toBe(false);

        const menuOverlay = button.nextElementSibling;

        expect(menuOverlay).toBeTruthy();
        await user.click(menuOverlay as Element);
        expect(button.parentElement?.classList.contains('active')).toBe(true);

        // Click within menuOverlay does not toggle
        const insideDiv = menuOverlay?.querySelector('div');

        await user.click(insideDiv as HTMLDivElement);
        expect(button.parentElement?.classList.contains('active')).toBe(true);
    });
    it('handles upper menus without Give', () => {
        (useGiveToday as jest.Mock).mockReturnValue({
            showButton: false
        });
        render(
            <MemoryRouter initialEntries={['/']}>
                <Menus />
            </MemoryRouter>
        );
        expect(screen.getAllByRole('listitem')).toHaveLength(18);
    });
});
