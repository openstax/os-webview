import React from 'react';
import {describe, it, expect} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import Menus from '~/layouts/default/header/menus/menus';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
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
const futureDate = new Date(Date.now() + 500000).toLocaleString();

jest.spyOn(CF, 'default').mockReturnValue(Promise.resolve({}));

describe('shell/header/menus', () => {
    const user = userEvent.setup();

    // eslint-disable-next-line complexity
    it('renders', async () => {
        mockUseDataFromPromise.mockReturnValueOnce({
            ...giveTodayData,
            menu_expires: futureDate
        });
        render(
            <MemoryRouter initialEntries={['/']}>
                <Menus />
            </MemoryRouter>
        );
        const listitems = screen.queryAllByRole('listitem');

        // The desktop Give menu item is off; Give button shows instead
        expect(listitems.filter((i) => i.textContent === 'Give').length).toBe(1);
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
        mockUseDataFromPromise.mockReturnValueOnce({
            ...giveTodayData
        });
        render(
            <MemoryRouter initialEntries={['/']}>
                <Menus />
            </MemoryRouter>
        );
        const listitems = screen.queryAllByRole('listitem');

        // No Give button, so Give menu item in both desktop and mobile
        expect(listitems.filter((i) => i.textContent === 'Give').length).toBe(2);
    });
});
