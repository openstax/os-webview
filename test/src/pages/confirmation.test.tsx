import React from 'react';
import {render, screen} from '@testing-library/preact';
import Confirmation from '~/pages/confirmation/confirmation';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import InPortal from '~/../../test/helpers/in-portal';
import * as DH from '~/helpers/use-document-head';

jest.spyOn(DH, 'default').mockReturnValue(undefined);

function Component({path}: {path: string}) {
    return (
        <MemoryRouter initialEntries={[path]}>
            <ShellContextProvider>
                <Confirmation />
            </ShellContextProvider>
        </MemoryRouter>
    );
}

function PortalComponent({path}: {path: string}) {
    return (
        <MemoryRouter initialEntries={[path]}>
            <ShellContextProvider>
                <InPortal portal="my-portal">
                    <Confirmation />
                </InPortal>
            </ShellContextProvider>
        </MemoryRouter>
    );
}

describe('confirmation', () => {
    it('does a contact thank you', () => {
        render(<Component path='/confirmation/contact' />);
        expect(screen.getByRole('heading').textContent).toBe('Thanks for contacting us');
    });
    it('does an errata thank you', async () => {
        render(<Component path='/confirmation/errata?id=7199' />);
        await screen.findByText('Date Submitted');
        expect(screen.getByRole('heading').textContent).toBe('Thanks for your help!');
    });
    it('handles errata-confirmation', async () => {
        render(<Component path='/errata-confirmation?id=7199' />);
        await screen.findByText('Date Submitted');
        expect(screen.getByRole('heading').textContent).toBe('Thanks for your help!');
    });
    it('does a contact thank you in a portal', async () => {
        render(<PortalComponent path='/my-portal/confirmation/contact' />);
        expect((await screen.findByRole('heading')).textContent).toBe('Thanks for contacting us');
    });
    it('does an errata thank you in a portal, with errata links in the portal', async () => {
        render(<PortalComponent path='/my-portal/confirmation/errata?id=7199' />);
        await screen.findByText('Date Submitted');
        expect(screen.getByRole('heading').textContent).toBe('Thanks for your help!');
        expect(screen.getByRole('link', {name: /^Submit .* errata$/}).getAttribute('href'))
            .toMatch(/^\/my-portal\/errata\/form\?book=/);
    });
});
