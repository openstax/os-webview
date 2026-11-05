import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen, waitFor} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import {schoolDataFor} from '~/../../test/helpers/in-portal';
import userEvent from '@testing-library/user-event';
import Breadcrumb, {RetraceableLink} from '~/components/breadcrumb/breadcrumb';
import usePortalContext, {PortalContextProvider} from '~/contexts/portal';

function Component({name}: {name: string}) {
    return (
        <MemoryRouter initialEntries={['/first', '/second', '/third']}>
            <PortalContextProvider>
                <Breadcrumb name={name} />
                <RetraceableLink
                    className='btn primary'
                    to='/third'
                    data-analytics-link='webinars_upcoming'
                >
                    View all upcoming webinars
                </RetraceableLink>
            </PortalContextProvider>
        </MemoryRouter>
    );
}

function SetPortal({portal}: {portal: string}) {
    const {setPortal, setSchoolData} = usePortalContext();

    React.useEffect(() => {
        setPortal(portal);
        setSchoolData(schoolDataFor(true));
    }, [setPortal, setSchoolData, portal]);
    return null;
}

// There's not much functionality to inspect, but you should have 100% code coverage
describe('breadcrumb', () => {
    it('navigates to new and retraceable links', async () => {
        render(<Component name="fourth" />);

        const user = userEvent.setup();

        await user.click(screen.getAllByRole('link')[0]);
        await user.click(screen.getAllByRole('link')[1]);
        await user.click(screen.getAllByRole('link')[0]);
    });

    it('links to the top level page outside a portal', () => {
        render(
            <MemoryRouter initialEntries={['/blog/some-article']}>
                <PortalContextProvider>
                    <Breadcrumb name="Blog" />
                </PortalContextProvider>
            </MemoryRouter>
        );

        expect(screen.getByRole('link').getAttribute('href')).toBe('/blog');
    });

    it('links to the top level page within the portal', async () => {
        render(
            <MemoryRouter initialEntries={['/my-portal/blog/some-article']}>
                <PortalContextProvider>
                    <SetPortal portal="my-portal" />
                    <Breadcrumb name="Blog" />
                </PortalContextProvider>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByRole('link').getAttribute('href')).toBe('/my-portal/blog'));
    });
});
