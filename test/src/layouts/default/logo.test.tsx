import React from 'react';
import {render, screen} from '@testing-library/preact';
import {useStreamlinedNav} from '~/contexts/shared-data';
import Logo from '~/layouts/default/header/menus/logo/logo';

jest.mock('~/contexts/shared-data', () => ({
    __esModule: true,
    default: jest.fn(() => ({flags: false})),
    useStreamlinedNav: jest.fn()
}));

describe('logo', () => {
    it('shows the quote and no Rice logo when not streamlined', () => {
        (useStreamlinedNav as jest.Mock).mockReturnValue(false);
        render(<Logo />);

        expect(screen.getByText('Access. The future of education.')).toBeTruthy();
        expect(screen.queryByRole('link', {name: 'Rice University logo'})).toBeNull();
    });

    it('shows the Rice logo and no quote when streamlined', () => {
        (useStreamlinedNav as jest.Mock).mockReturnValue(true);
        render(<Logo />);

        expect(
            screen.getByRole('link', {name: 'Rice University logo'}).getAttribute('href')
        ).toBe('https://www.rice.edu');
        expect(screen.queryByText('Access. The future of education.')).toBeNull();
    });
});
