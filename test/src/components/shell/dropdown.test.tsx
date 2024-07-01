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
                    <hr />
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
    it('desktop menu opens and closes by mouse enter/leave', () => {
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

        await user.click(buttons[0]);
        expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
        await user.click(buttons[1]);
        expect(buttons[0].getAttribute('aria-expanded')).toBe('false');
    });
    it('desktop: allows keyboard navigation', async () => {
        mobileSpy.mockReturnValue(false);
        render(<Component />);
        const buttons = screen.getAllByRole('button');

        buttons[0].focus();
        await user.keyboard('{Enter}{ArrowDown}{ArrowDown}');
        expect(document.activeElement?.textContent).toBe('Item 1-2');
        // Wraps around from last element to first
        await user.keyboard('{ArrowDown}{ArrowDown}');
        expect(document.activeElement?.textContent).toBe('Item 1-1');
        // Goes up to the button and stays there
        await user.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}');
        expect(document.activeElement?.textContent).toBe('First item arrow');
        // Tab is ignored
        await user.keyboard('{Tab}{Escape}');
        expect(document.activeElement?.textContent).toContain('First item arrow');
    });
    it('mobile: allows keyboard navigation', async () => {
        mobileSpy.mockReturnValue(true);
        render(<Component />);
        const buttons = screen.getAllByRole('button');

        buttons[0].focus();
        await user.keyboard('{Enter}');
        expect(document.activeElement?.textContent).toBe('First item arrow');
        await user.keyboard('{Escape}');
        expect(document.activeElement?.textContent).toContain('First item arrow');
        // mobile ignores these
        await user.keyboard('{ArrowRight}{Home}');
        expect(document.activeElement?.textContent).toContain('First item arrow');
    });
});
