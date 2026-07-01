import React from 'react';
import {render, screen} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import * as CF from '~/helpers/cms-fetch';
import {useStreamlinedNav} from '~/contexts/shared-data';
import Menus from '~/layouts/default/header/menus/menus';

/* eslint-disable camelcase */
// Menus consumes only useStreamlinedNav (not the provider), so fully stub the
// module — this avoids loading the real flags promise / cms-fetch.
jest.mock('~/contexts/shared-data', () => ({
    __esModule: true,
    default: jest.fn(() => ({flags: false})),
    useStreamlinedNav: jest.fn()
}));

jest.spyOn(CF, 'default').mockReturnValue(Promise.resolve({all_flags: []}));

function renderMenus() {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Menus />
        </MemoryRouter>
    );
}

describe('streamlined nav — utility bar', () => {
    it('shows the Upper Menu bar when not streamlined', () => {
        (useStreamlinedNav as jest.Mock).mockReturnValue(false);
        renderMenus();

        expect(screen.getByRole('navigation', {name: 'Upper Menu'})).toBeTruthy();
    });

    it('hides the Upper Menu bar when streamlined', () => {
        (useStreamlinedNav as jest.Mock).mockReturnValue(true);
        renderMenus();

        expect(screen.queryByRole('navigation', {name: 'Upper Menu'})).toBeNull();
    });
});
