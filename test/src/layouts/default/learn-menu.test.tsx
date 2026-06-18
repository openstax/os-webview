import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {readFileSync} from 'fs';
import path from 'path';
import ShellContextProvider from '../../../helpers/shell-context';
import MemoryRouter from '../../../helpers/future-memory-router';
import usePortalContext from '~/contexts/portal';
import {DropdownContextProvider} from '~/layouts/default/header/menus/dropdown-context';
import LearnMenu from '~/layouts/default/header/menus/main-menu/learn-menu/learn-menu';

function PortalSetter({portal}: {portal: string}) {
    const {setPortal} = usePortalContext();

    React.useEffect(() => setPortal(portal), [portal, setPortal]);

    return null;
}

function Component({path = '/', portal = ''}) {
    return (
        <ShellContextProvider>
            <MemoryRouter initialEntries={[path]}>
                <DropdownContextProvider>
                    {portal ? <PortalSetter portal={portal} /> : null}
                    <ul>
                        <LearnMenu />
                    </ul>
                </DropdownContextProvider>
            </MemoryRouter>
        </ShellContextProvider>
    );
}

describe('learn-menu', () => {
    it('shows the library header, subjects, and extra links', async () => {
        const user = userEvent.setup();

        render(<Component />);
        await user.click(await screen.findByRole('button', {name: /Learn/}));

        // Header links to the full library
        const header = screen.getByRole('link', {name: /Visit the library/});

        expect(header.getAttribute('href')).toBe('/subjects');

        // Dynamic subjects present, but not the View All / K12 entries
        await screen.findByRole('link', {name: 'Math'});
        expect(screen.queryByRole('link', {name: 'View All'})).toBeNull();
        expect(screen.queryByRole('link', {name: 'K12'})).toBeNull();

        // Hardcoded extra links
        const print = screen.getByRole('link', {name: 'Order a print copy'});

        expect(print.getAttribute('href')).toBe('/print/');
        screen.getByRole('link', {name: 'Assignable'});
    });

    it('keeps internal links inside the current portal', async () => {
        const user = userEvent.setup();

        render(<Component portal="k12" />);
        await user.click(await screen.findByRole('button', {name: /Learn/}));

        const header = screen.getByRole('link', {name: /Visit the library/});

        await waitFor(() => expect(header.getAttribute('href')).toBe('/k12/subjects'));
        expect(screen.getByRole('link', {name: 'Math'}).getAttribute('href'))
            .toBe('/k12/subjects/math');
        expect(screen.getByRole('link', {name: 'Assignable'}).getAttribute('href'))
            .toBe('/k12/assignable');
        expect(screen.getByRole('link', {name: 'Order a print copy'}).getAttribute('href'))
            .toBe('/k12/print/');
    });

    it('labels language links with the OpenStax brand', async () => {
        const user = userEvent.setup();

        render(<Component />);
        await user.click(await screen.findByRole('button', {name: /Learn/}));

        screen.getByRole('link', {name: 'OpenStax in Spanish'});
        screen.getByRole('link', {name: 'OpenStax in Polish'});
    });

    it('lets the mega menu fit inside the mobile menu panel', () => {
        const scss = readFileSync(
            path.join(
                process.cwd(),
                'src/app/layouts/default/header/menus/main-menu/learn-menu/learn-menu.scss'
            ),
            'utf8'
        );
        const mobileMenuPattern = /\.menus\.mobile[\s\S]*\.learn-dropdown \.mega-menu/;

        expect(scss).toMatch(new RegExp(`${mobileMenuPattern.source}[\\s\\S]*min-width:\\s*0`));
        expect(scss).toMatch(new RegExp(`${mobileMenuPattern.source}[\\s\\S]*width:\\s*100%`));
    });
});
