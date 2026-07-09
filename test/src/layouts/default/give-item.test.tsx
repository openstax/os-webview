import React from 'react';
import {render, screen} from '@testing-library/preact';
import useGiveToday from '~/models/give-today';
import GiveItem from '~/layouts/default/header/menus/give-item/give-item';

jest.mock('~/models/give-today', () => jest.fn());

const RICECONNECT = 'https://riceconnect.rice.edu/donation/support-openstax-header';

describe('GiveItem', () => {
    it('renders a Give text link to RiceConnect when no campaign is active', () => {
        (useGiveToday as jest.Mock).mockReturnValue({showButton: false});
        render(<GiveItem />);

        const link = screen.getByRole('link', {name: 'Give'});

        expect(link.getAttribute('href')).toBe(RICECONNECT);
        expect(link.getAttribute('target')).toBe('_blank');
    });

    it('renders the gold Give button during an active campaign', () => {
        (useGiveToday as jest.Mock).mockReturnValue({
            showButton: true,
            give_link: 'https://example.test/campaign'
        });
        render(<GiveItem />);

        const link = screen.getByRole('link', {name: 'Give'});

        expect(link.classList.contains('give-button')).toBe(true);
        expect(link.getAttribute('href')).toBe('https://example.test/campaign');
    });
});
