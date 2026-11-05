import React from 'react';
import {render, screen} from '@testing-library/preact';
import Logo from '~/layouts/default/header/menus/logo/logo';

describe('logo', () => {
    it('links both logos to the OpenStax homepage', () => {
        render(<Logo />);

        expect(
            screen.getByRole('link', {name: 'OpenStax'}).getAttribute('href')
        ).toBe('/');
        expect(
            screen.getByRole('link', {name: 'OpenStax home'}).getAttribute('href')
        ).toBe('/');
    });
});
