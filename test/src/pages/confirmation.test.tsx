import React from 'react';
import {render, screen} from '@testing-library/preact';
import {Routes, Route} from 'react-router-dom';
import Confirmation from '~/pages/confirmation/confirmation';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import InPortal from '~/../../test/helpers/in-portal';
import * as DH from '~/helpers/use-document-head';

jest.spyOn(DH, 'default').mockReturnValue(undefined);

// Routed like the app routes it: /<page>/* outside a portal
function Component({path}: {path: string}) {
    return (
        <MemoryRouter initialEntries={[path]}>
            <ShellContextProvider>
                <Routes>
                    <Route path="/:dir/*" element={<Confirmation />} />
                </Routes>
            </ShellContextProvider>
        </MemoryRouter>
    );
}

// Routed like the app routes it: /<portal>/confirmation/* in a portal
function PortalComponent({path}: {path: string}) {
    return (
        <MemoryRouter initialEntries={[path]}>
            <ShellContextProvider>
                <InPortal portal="my-portal">
                    <Routes>
                        <Route
                            path="/:dir/*"
                            element={
                                <Routes>
                                    <Route path="/confirmation/*" element={<Confirmation />} />
                                </Routes>
                            }
                        />
                    </Routes>
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
    it('reads a page name with escapes', () => {
        render(<Component path='/confirmation/%63ontact/' />);
        expect(screen.getByRole('heading').textContent).toBe('Thanks for contacting us');
    });
    it('shows the not found page for an unknown page', () => {
        render(<Component path='/confirmation/unknown' />);
        expect(screen.getByRole('heading').textContent).toBe('Uh-oh, no page here');
    });
    it('does a contact thank you in a portal', async () => {
        render(<PortalComponent path='/my-portal/confirmation/contact' />);
        expect((await screen.findByRole('heading')).textContent).toBe('Thanks for contacting us');
    });
    it('does a contact thank you in a portal when confirmation has escapes', async () => {
        render(<PortalComponent path='/my-portal/%63onfirmation/contact' />);
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
