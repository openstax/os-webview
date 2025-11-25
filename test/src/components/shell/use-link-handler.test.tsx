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

function setPortalPrefix(portalPrefix: string) {
    jest.spyOn(PC, 'default').mockReturnValue({
        portalPrefix,
        setPortal,
        rewriteLinks: jest.fn()
    });
}

type WindowWithPiTracker = (typeof window) & {
    piTracker: (path: string) => void;
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
    it('calls piTracker if available', async () => {
        setPortalPrefix('/portal');
        const navigate = jest.fn();

        w.piTracker = (path: string) => piTracker(path);

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
