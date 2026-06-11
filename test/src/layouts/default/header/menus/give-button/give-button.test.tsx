import React from 'react';
import {render, screen} from '@testing-library/preact';
import '@testing-library/jest-dom';
import GiveButton from '~/layouts/default/header/menus/give-button/give-button';
import * as giveToday from '~/models/give-today';

describe('GiveButton', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('does not render when showButton is false', () => {
        jest.spyOn(giveToday, 'default').mockReturnValue({
            showButton: false
        });

        const {container} = render(<GiveButton />);

        expect(container.querySelector('.give-button')).toBeNull();
    });

    it('renders button with link when showButton is true', () => {
        jest.spyOn(giveToday, 'default').mockReturnValue({
            showButton: true,
            give_link: 'https://example.com/donate'
        });

        render(<GiveButton />);

        const link = screen.getByRole('link', {name: 'Give'});

        expect(link).toBeInTheDocument();
        expect(link.getAttribute('href')).toBe('https://example.com/donate');
        expect(link.className).toBe('give-button medium');
        expect(link.getAttribute('data-analytics-link')).toBe('');
    });

    it('handles empty give_link gracefully', () => {
        jest.spyOn(giveToday, 'default').mockReturnValue({
            showButton: true,
            give_link: undefined
        });

        const {container} = render(<GiveButton />);

        const anchor = container.querySelector('a.give-button');

        expect(anchor).toBeInTheDocument();
        expect(anchor?.textContent).toBe('Give');
        expect(anchor?.getAttribute('href')).toBeNull();
    });

    it('handles missing data gracefully', () => {
        jest.spyOn(giveToday, 'default').mockReturnValue({});

        const {container} = render(<GiveButton />);

        expect(container.querySelector('.give-button')).toBeNull();
    });
});
