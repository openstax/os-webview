import React from 'react';
import {describe, it, expect} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import Menus from '~/layouts/default/header/menus/menus';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import userEvent from '@testing-library/user-event';
import * as PDU from '~/helpers/page-data-utils';
import * as CF from '~/helpers/cms-fetch';

/* eslint-disable camelcase */

const mockUseDataFromPromise = jest.spyOn(PDU, 'useDataFromPromise');
const giveTodayData = {
    give_link_text: 'Give',
    give_link: 'https://riceconnect.rice.edu/donation/support-openstax-header',
    start: '2023-04-04T05:00:00Z',
    expires: '2023-04-05T05:00:00Z',
    menu_start: '2023-12-14T06:00:00Z',
    menu_expires: '2024-04-01T23:00:00Z'
};
const futureDate = new Date(Date.now() + 500000).toISOString();

const isGiveListItem = (item: HTMLElement) => item.textContent?.trim() === 'Give';

jest.spyOn(CF, 'default').mockReturnValue(Promise.resolve([]));

describe('shell/header/menus', () => {
    const user = userEvent.setup();

    // eslint-disable-next-line complexity
    it('renders', async () => {
        mockUseDataFromPromise.mockReturnValueOnce({
            ...giveTodayData,
            menu_expires: futureDate
        });
        render(
            <ShellContextProvider>
                <MemoryRouter initialEntries={['/']}>
                    <Menus />
                </MemoryRouter>
            </ShellContextProvider>
        );
        const listitems = screen.queryAllByRole('listitem');

        // Give button renders (dates active) => 1 Give list item in the desktop main menu
        expect(listitems.filter(isGiveListItem).length).toBe(1);
        const button = screen.getByRole('button', {name: /Toggle/});

        expect(screen.getAllByRole('link', {name: 'Log in'})).toHaveLength(2);
        // Utility bar is gone
        expect(screen.queryByText('Order Print')).toBeNull();
        expect(screen.queryByText('Our Impact')).toBeNull();
        await user.click(button);
        button.focus();
        expect(document.activeElement).toBe(button);
        expect(button.parentElement?.classList.contains('active')).toBe(true);
        await user.keyboard('{Escape}');
        expect(button.parentElement?.classList.contains('active')).toBe(false);
    });
    it('shows Give menu item when the give button is off', () => {
        mockUseDataFromPromise.mockReturnValueOnce({
            ...giveTodayData
        });
        render(
            <ShellContextProvider>
                <MemoryRouter initialEntries={['/']}>
                    <Menus />
                </MemoryRouter>
            </ShellContextProvider>
        );
        const listitems = screen.queryAllByRole('listitem');

        // No Give button (dates expired), so no Give menu items anywhere
        expect(listitems.filter(isGiveListItem).length).toBe(0);
        // Utility bar is gone
        expect(screen.queryByText('Help')).toBeNull();
    });
});
