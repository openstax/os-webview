import React from 'react';
import {describe, it, expect} from '@jest/globals';
import {render, screen, fireEvent} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import { DropdownContextProvider } from '~/components/shell/header/menus/dropdown-context';
import Dropdown, {MenuItem} from '~/components/shell/header/menus/main-menu/dropdown/dropdown';
import * as deviceHelpers from '~/helpers/device';

const mobileSpy = jest.spyOn(deviceHelpers, 'isMobileDisplay');

function Component() {
    return (
        <DropdownContextProvider>
            <MemoryRouter initialEntries={['/selector?Calculus']}>
                <Dropdown label='First item' navAnalytics='Na1'>
                    <MenuItem label='Item 1-1' url='/item-1-1' />
                    <MenuItem label='Item 1-2' url='/item-1-2' />
                    <MenuItem label='Item 1-3' url='/item-1-3' />
                </Dropdown>
                <Dropdown label='Second item' navAnalytics='Na2'>
                    <MenuItem label='Item 2-1' url='/item-2-1' />
                    <MenuItem label='Item 2-2' url='/item-2-2' />
                    <MenuItem label='Item 2-3' url='/item-2-3' />
                </Dropdown>
            </MemoryRouter>
        </DropdownContextProvider>
    );
}

describe('main-menu dropdowns', () => {
    const user = userEvent.setup();

    // First two test use-menu-controls. 
    it('desktop menu opens and closes by mouse enter/leave', async () => {
        render(<Component />);
        const buttons = screen.getAllByRole('button');

        expect(buttons).toHaveLength(2);
        fireEvent(buttons[0], new MouseEvent('mouseenter', {
            bubbles: true
        }));
        expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
        fireEvent(buttons[0], new MouseEvent('mouseleave', {
            bubbles: true
        }));
        expect(buttons[0].getAttribute('aria-expanded')).toBe('false');
    });
    it('mobile menu opens and closes', async () => {
        mobileSpy.mockReturnValue(true);
        render(<Component />);
        const buttons = screen.getAllByRole('button');

        expect(buttons).toHaveLength(2);
        buttons[0].focus();
        await user.click(buttons[0]);
        expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
        await user.click(buttons[1]);
        expect(buttons[0].getAttribute('aria-expanded')).toBe('false');
    });
});
