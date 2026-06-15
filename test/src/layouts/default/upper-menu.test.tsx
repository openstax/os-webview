import React from 'react';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '../../../helpers/shell-context';
import UpperMenu from '~/layouts/default/header/menus/upper-menu/upper-menu';
import MemoryRouter from '../../../helpers/future-memory-router';
import * as PDU from '~/helpers/page-data-utils';
import type {NavNode} from '~/helpers/nav-nodes';

jest.mock('~/models/give-today', () => jest.fn().mockReturnValue({showButton: false}));

function Component() {
    return (
        <ShellContextProvider>
            <MemoryRouter>
                <UpperMenu />
            </MemoryRouter>
        </ShellContextProvider>
    );
}

afterEach(() => jest.restoreAllMocks());

describe('upper-menu', () => {
    it('renders utility-region links from CMS (not hardcoded)', () => {
        // 'OpenStax Webinars' is not in the old hardcoded menuStructure,
        // so this test fails until upper-menu consumes CMS data.
        jest.spyOn(PDU, 'useDataFromSlug').mockReturnValue([
            {type: 'link', region: 'utility', label: 'OpenStax Webinars', partial_url: '/webinars'},
            {type: 'link', region: 'main', label: 'Technology', partial_url: '/technology'},
            {type: 'link', region: 'utility', label: 'Help', partial_url: 'https://help.openstax.org/s/'}
        ] as NavNode[]);

        render(<Component />);

        const webinarsLink = screen.getByRole('link', {name: 'OpenStax Webinars'});

        expect(webinarsLink).toBeTruthy();
        expect(webinarsLink.getAttribute('href')).toBe('/webinars');
    });

    it('does not render main-region nodes in the utility bar', () => {
        jest.spyOn(PDU, 'useDataFromSlug').mockReturnValue([
            {type: 'link', region: 'utility', label: 'OpenStax Webinars', partial_url: '/webinars'},
            {type: 'link', region: 'main', label: 'Technology', partial_url: '/technology'}
        ] as NavNode[]);

        render(<Component />);

        expect(screen.queryByRole('link', {name: 'Technology'})).toBeNull();
        expect(screen.getByRole('link', {name: 'OpenStax Webinars'})).toBeTruthy();
    });
});
