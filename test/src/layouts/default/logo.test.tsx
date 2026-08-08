import React from 'react';
import {render, screen} from '@testing-library/preact';
import Logo from '~/layouts/default/header/menus/logo/logo';

describe('logo', () => {
    it('links the OpenStax logo home and the Rice logo to rice.edu', () => {
        render(<Logo />);

        expect(
            screen.getByRole('link', {name: 'OpenStax'}).getAttribute('href')
        ).toBe('/');
        expect(
            screen.getByRole('link', {name: 'Rice University logo'}).getAttribute('href')
        ).toBe('https://www.rice.edu');
    });
});
