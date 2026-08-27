import React from 'react';
import {describe, it, expect} from '@jest/globals';
import {render, screen, fireEvent} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import useLinkHandler, {
    TrackedMouseEvent
} from '~/components/shell/router-helpers/use-link-handler';
import linkHelper from '~/helpers/link';
import {useNavigate} from 'react-router-dom';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import * as PC from '~/contexts/portal';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    __esModule: true,
    useNavigate: jest.fn()
}));

const setPortal = jest.fn();

function setPortalPrefix(portalPrefix: string, isK12Portal: boolean = false) {
    jest.spyOn(PC, 'default').mockReturnValue({
        portalPrefix,
        setPortal,
        rewriteLinks: jest.fn(),
        isK12Portal,
        setIsK12Portal: jest.fn()
    });
}

type WindowWithPiTracker = (typeof window) & {
    piTracker?: (path: string) => void;
}
const w = window as WindowWithPiTracker;
const piTracker = jest.fn();


describe('use-link-handler', () => {
    const user = userEvent.setup();
    const notPrevented = jest.fn();
    const InnerComponent = ({track = false}) => {
        const linkHandler = useLinkHandler();
        const onClick = React.useCallback(
            (e: React.MouseEvent) => {
                if (track) {
                    // eslint-disable-next-line camelcase
                    (e as TrackedMouseEvent).trackingInfo = {book: 'junk', account_uuid: '1234'};
                }
                linkHandler(e as TrackedMouseEvent);
                if (!e.defaultPrevented) {
                    notPrevented(true);
                }
                e.preventDefault();
            },
            [linkHandler, track]
        );

        return <a href="https://dev.openstax.org/some-url" onClick={onClick} />;
    };
    const Component = (props: Parameters<typeof InnerComponent>[0]) => (
        <MemoryRouter initialEntries={['/']}>
            <InnerComponent {...props} />
        </MemoryRouter>
    );
    const saveError = console.error;

    afterEach(jest.resetAllMocks);

    jest.spyOn(window, 'open').mockImplementation(() => null);

    it('short-circuits if not a valid URL click', async () => {
        jest.spyOn(linkHelper, 'validUrlClick').mockReturnValue(false);

        render(<Component />);
        await user.click(screen.getByRole('link'));
        expect(notPrevented).toBeCalledWith(true);
    });
    it('short-circuits if not left mouse button', () => {
        const el = document.createElement('a');

        jest.spyOn(linkHelper, 'validUrlClick').mockReturnValue(el);

        render(<Component />);
        fireEvent(
            screen.getByRole('link'),
            new MouseEvent('click', {
                button: 3
            })
        );
        expect(notPrevented).toBeCalledWith(true);
    });
    it('goes on when left click on valid URL', async () => {
        setPortalPrefix('/portal');
        const navigate = jest.fn();
        const el = document.createElement('a');

        jest.spyOn(linkHelper, 'validUrlClick').mockReturnValue(el);
        jest.spyOn(linkHelper, 'stripOpenStaxDomain').mockReturnValue(
            'whatever'
        );
        (useNavigate as jest.Mock).mockReturnValue(navigate);

        render(<Component />);
        console.error = jest.fn();
        await user.click(screen.getByRole('link'));
        expect(console.error).toHaveBeenCalled();
        console.error = saveError;
        expect(notPrevented).not.toBeCalled();
        expect(navigate).toBeCalledWith('whatever', {x: 0, y: 0});
    });
    it('Changes window location when stripping does nothing', async () => {
        setPortalPrefix('/portal');
        const el = document.createElement('a');

        jest.spyOn(linkHelper, 'validUrlClick').mockReturnValue(el);
        jest.spyOn(linkHelper, 'stripOpenStaxDomain').mockReturnValue(
            'http://whatever'
        );

        render(<Component />);
        console.error = jest.fn();
        await user.click(screen.getByRole('link'));
        expect(console.error).toHaveBeenCalled();
        console.error = saveError;
        expect(notPrevented).not.toBeCalled();
    });
    it('calls piTracker for external links', async () => {
        setPortalPrefix('/portal');
        const navigate = jest.fn();

        w.piTracker = (path: string) => piTracker(path);

        jest.spyOn(linkHelper, 'isExternal').mockReturnValue(true);
        jest.spyOn(linkHelper, 'validUrlClick').mockReturnValue({
            target: 'clickTarget',
            href: 'clickHref',
            dataset: {},
            trackingInfo: {payload: 'junk'}
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        jest.spyOn(linkHelper, 'stripOpenStaxDomain').mockReturnValue(
            'whatever'
        );
        (useNavigate as jest.Mock).mockReturnValue(navigate);

        render(<Component />);
        await user.click(screen.getByRole('link'));
        expect(notPrevented).not.toBeCalled();
        expect(piTracker).toBeCalledWith('clickHref');
    });
    it('tolerates external clicks when piTracker is absent', async () => {
        setPortalPrefix('/portal');
        delete w.piTracker;

        jest.spyOn(linkHelper, 'isExternal').mockReturnValue(true);
        jest.spyOn(linkHelper, 'validUrlClick').mockReturnValue({
            target: 'clickTarget',
            href: 'clickHref',
            dataset: {}
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

        render(<Component />);
        await user.click(screen.getByRole('link'));
        expect(piTracker).not.toBeCalled();
    });
    it('does not call piTracker for internal links', async () => {
        setPortalPrefix('/portal');
        const navigate = jest.fn();

        w.piTracker = (path: string) => piTracker(path);

        jest.spyOn(linkHelper, 'isExternal').mockReturnValue(false);
        jest.spyOn(linkHelper, 'validUrlClick').mockReturnValue({
            href: 'clickHref',
            dataset: {}
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        jest.spyOn(linkHelper, 'stripOpenStaxDomain').mockReturnValue(
            'whatever'
        );
        (useNavigate as jest.Mock).mockReturnValue(navigate);

        render(<Component />);
        await user.click(screen.getByRole('link'));
        expect(piTracker).not.toBeCalled();
        expect(navigate).toBeCalledWith('whatever', {x: 0, y: 0});
    });
    it('handles external URL opening local', async () => {
        setPortalPrefix('/portal');
        const navigate = jest.fn();

        jest.spyOn(linkHelper, 'validUrlClick').mockReturnValue({
            target: 'clickTarget',
            href: 'clickHref',
            dataset: {local: 'true'},
            preventDefault() {return;}
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        jest.spyOn(linkHelper, 'stripOpenStaxDomain').mockReturnValue(
            'whatever'
        );
        jest.spyOn(linkHelper, 'isExternal').mockReturnValue(true);
        (useNavigate as jest.Mock).mockReturnValue(navigate);

        render(<Component />);
        console.error = jest.fn();
        await user.click(screen.getByRole('link'));
        expect(console.error).toHaveBeenCalled();
        console.error = saveError;
        expect(notPrevented).not.toBeCalled();
        expect(navigate).not.toBeCalled();
    });
    it('handles external URL opening in current tab when new window fails', async () => {
        setPortalPrefix('/portal');
        const navigate = jest.fn();

        jest.spyOn(linkHelper, 'validUrlClick').mockReturnValue({
            target: 'clickTarget',
            href: 'clickHref',
            dataset: {},
            preventDefault() {return;}
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        jest.spyOn(linkHelper, 'stripOpenStaxDomain').mockReturnValue(
            'whatever'
        );
        jest.spyOn(linkHelper, 'isExternal').mockReturnValue(true);
        jest.spyOn(window, 'open').mockReturnValue(null);
        (useNavigate as jest.Mock).mockReturnValue(navigate);

        render(<Component />);
        console.error = jest.fn();
        await user.click(screen.getByRole('link'));
        expect(console.error).toHaveBeenCalled();
        console.error = saveError;
        expect(notPrevented).not.toBeCalled();
        expect(navigate).not.toBeCalled();
    });
    it('does the tracking info fetch', async () => {
        setPortalPrefix('/portal');
        const navigate = jest.fn();

        jest.spyOn(linkHelper, 'validUrlClick').mockReturnValue({
            target: 'clickTarget',
            href: 'clickHref',
            preventDefault() {return;},
            dataset: {}
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        jest.spyOn(linkHelper, 'stripOpenStaxDomain').mockReturnValue(
            'whatever'
        );
        (useNavigate as jest.Mock).mockReturnValue(navigate);

        render(<Component track />);
        jest.spyOn(window, 'fetch').mockImplementation(
            () => Promise.resolve({} as Response)
        );
        await user.click(screen.getByRole('link'));
    });
    it('opens the resource without waiting for the report', async () => {
        setPortalPrefix('/portal');
        const navigate = jest.fn();
        const open = jest.spyOn(window, 'open').mockReturnValue({} as Window);

        jest.spyOn(linkHelper, 'validUrlClick').mockReturnValue({
            target: '',
            href: 'clickHref',
            preventDefault() {return;},
            dataset: {}
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        jest.spyOn(linkHelper, 'stripOpenStaxDomain').mockReturnValue(
            'whatever'
        );
        jest.spyOn(linkHelper, 'isExternal').mockReturnValue(true);
        (useNavigate as jest.Mock).mockReturnValue(navigate);

        render(<Component track />);
        // A report that never settles stands in for a slow or retried one. The
        // resource still has to open, or the popup blocker gets it instead.
        jest.spyOn(window, 'fetch').mockImplementation(
            () => new Promise<Response>(() => undefined)
        );
        await user.click(screen.getByRole('link'));

        expect(window.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/salesforce/download-tracking/'),
            expect.objectContaining({keepalive: true})
        );
        expect(open).toHaveBeenCalledWith('clickHref', '_blank');
    });
    it('catches tracking fetch failure', async () => {
        setPortalPrefix('/');
        const navigate = jest.fn();

        jest.spyOn(linkHelper, 'validUrlClick').mockReturnValue({
            target: 'clickTarget',
            href: 'clickHref',
            preventDefault() {return;},
            dataset: {}
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        jest.spyOn(linkHelper, 'stripOpenStaxDomain').mockReturnValue(
            'whatever'
        );
        jest.spyOn(console, 'error').mockImplementation(() => null);
        (useNavigate as jest.Mock).mockReturnValue(navigate);

        render(<Component track />);
        jest.spyOn(window, 'fetch').mockImplementation(
            () => {
                throw new Error('oops');
            }
        );
        await user.click(screen.getByRole('link'));
        expect(console.error).toBeCalled();
        console.error = saveError;
    });
});
