import React from 'react';
import {render, screen} from '@testing-library/preact';
import Logo from '~/layouts/default/header/menus/logo/logo';

describe('logo', () => {
    it('links to Rice University over https', () => {
        render(<Logo />);

        expect(screen.getByRole('link', {name: 'Rice University logo'}).getAttribute('href'))
            .toBe('https://www.rice.edu');
    });
});
