import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import AppElement from '~/components/shell/shell';
import * as RRD from 'react-router-dom';
import MR from '~/../../test/helpers/future-memory-router';
import * as UPD from '~/helpers/use-page-data';
import * as PC from '~/contexts/portal';
import * as GP from '~/pages/general/general';
import * as LDH from '~/layouts/default/header/header';
import * as MM from '~/layouts/default/header/menus/menus';
import * as MSP from '~/layouts/default/microsurvey-popup/microsurvey-popup';
import * as WC from '~/layouts/default/welcome/welcome-content';
import * as TD from '~/layouts/default/takeover-dialog/takeover-dialog';
import * as LSN from '~/layouts/default/lower-sticky-note/lower-sticky-note';
import * as DH from '~/helpers/use-document-head';
import * as UC from '~/contexts/user';
import {camelCaseKeys, transformData} from '~/helpers/page-data-utils';
import landingPage from '../data/landing-page';
import contactPage from '../data/contact-page';
import homePage from '../data/home-page';
import subjectPage from '../data/new-subjects';
import flexPage from '../data/flex-page';
import generalPage from '../data/general-page';
import ChildrenContainer from '~/../../test/helpers/mock-children-container';

const {useLocation} = RRD;
const BrowserRouter = jest.spyOn(RRD, 'BrowserRouter').mockImplementation(({children}) => (
    <MR initialEntries={['/']}>{children}</MR>
));

jest.mock('react-modal', () => ({
    setAppElement: jest.fn()
}));
global.scrollTo = jest.fn();

describe('shell', () => {
    const user = userEvent.setup();

    function LocationDisplay() {
        const loc = useLocation();

        return <div>-{loc.pathname}-</div>;
    }
    // eslint-disable-next-line complexity
    const spyUpd = jest.spyOn(UPD, 'default').mockImplementation((path) => {
        switch (path) {
            case 'pages/landing-page':
                return camelCaseKeys(landingPage);
            case 'pages/flex-page':
                // @ts-expect-error some format thing
                return camelCaseKeys(flexPage);
            case 'pages/contact':
                return camelCaseKeys(transformData(contactPage));
            case 'footer':
                return {}; // don't really care
            case 'pages/home':
                // @ts-expect-error some format thing
                return camelCaseKeys(homePage);
            case 'pages/subjects':
            case 'pages/new-subjects':
                return camelCaseKeys(subjectPage);
            case 'pages/invalid':
                return {error: 'intentional'};
            case 'pages/general-page':
                return camelCaseKeys(transformData(generalPage));
            default:
                if (path.startsWith('errata/') || path.startsWith('pages/')
                || path.startsWith('snippets/roles')) {
                    return [];
                }
                console.info('*** Requested', path);
                return {};
        }
    });
    const setPortal = jest.fn();
    const spyGP = jest.spyOn(GP, 'GeneralPageFromSlug');

    function setPortalPrefix(portalPrefix: string) {
        jest.spyOn(PC, 'default').mockReturnValue({
            portalPrefix,
            setPortal,
            rewriteLinks: jest.fn()
        });
    }

    beforeAll(() => {
        // Pieces we don't need to test in here
        jest.spyOn(LDH, 'default').mockReturnValue(<></>);
        jest.spyOn(MM, 'default').mockReturnValue(<></>);
        jest.spyOn(MSP, 'default').mockReturnValue(null);
        jest.spyOn(WC, 'default').mockReturnValue(null);
        jest.spyOn(TD, 'default').mockReturnValue(null);
        jest.spyOn(LSN, 'default').mockReturnValue(null);
        jest.spyOn(DH, 'setPageDescription').mockReturnValue(undefined);
        jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData').mockReturnValue(undefined);
        jest.spyOn(UC, 'UserContextProvider').mockImplementation(ChildrenContainer);
        jest.spyOn(UC, 'default').mockReturnValue({} as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    });

    afterEach(() => {
        setPortal.mockClear();
    });

    it('Delivers embedded contact page', async () => {
        BrowserRouter.mockImplementationOnce(({children}) => (
            <MR initialEntries={['/embedded/contact']} >{children}</MR>
        ));
        spyUpd.mockReturnValueOnce(null);

        render(AppElement);
        await screen.findByText('What is your question about?');
        expect(screen.queryAllByRole('navigation')).toHaveLength(0);
    });
    it('handles piTracker ', async () => {
        type WindowWithPiTracker = (typeof window) & {
            piTracker?: (path: string) => void;
        }
        const w = window as WindowWithPiTracker;
        const piTracker = jest.fn();

        w.piTracker = (path: string) => piTracker(path);

        BrowserRouter.mockImplementationOnce(({children}) => (
            <MR initialEntries={['/']}>{children}</MR>
        ));

        render(AppElement);

        await waitFor(() => expect(piTracker).toHaveBeenCalled());
        delete w.piTracker;
    });
    it('(skip to main content link) works', async () => {
        window.scrollBy = jest.fn();
        BrowserRouter.mockImplementationOnce(({children}) => (
            <MR initialEntries={['/']}>{children}</MR>
        ));
        render(AppElement);
        const skipLink = await screen.findByRole('link', {name: 'skip to main content'});

        await user.click(skipLink);
        await waitFor(() => expect(window.scrollBy).toHaveBeenCalled());
    });
    it('routes "home/anything" to top-level', async () => {
        BrowserRouter.mockImplementationOnce(({children}) => (
            <MR initialEntries={['/home/anything']} >
                {children}
                <LocationDisplay />
            </MR>
        ));

        render(AppElement);
        await screen.findByText('-/-');
    });
    it('routes "general/anything" to "/anything"', async () => {
        BrowserRouter.mockImplementationOnce(({children}) => (
            <MR initialEntries={['/general/anything']} >
                {children}
                <LocationDisplay />
            </MR>
        ));

        render(AppElement);
        await screen.findByText('-/anything-');
    });
    it('routes adoption (no CMS page data) page', async () => {
        BrowserRouter.mockImplementationOnce(({children}) => (
            <MR initialEntries={['/adoption']} >{children}</MR>
        ));

        render(AppElement);
        await screen.findByText('Adoption Form', {exact: false});
        screen.getByRole('combobox');
    });
    it('routes "errata" paths', async () => {
        BrowserRouter.mockImplementationOnce(({children}) => (
            <MR initialEntries={['/errata']} >{children}</MR>
        ));

        render(AppElement);
        await screen.findByRole('radio', {name: 'In Review'});
    });
    it('routes "details" paths (top level routes to Subjects)', async () => {
        BrowserRouter.mockImplementationOnce(({children}) => (
            <MR initialEntries={['/details']} >{children}</MR>
        ));

        render(AppElement);
        await screen.findByRole('heading', {level: 1, name: 'Browse our subjects'});
    });
    it('routes "books" to details', async () => {
        BrowserRouter.mockImplementationOnce(({children}) => (
            <MR initialEntries={['/books/some-book']} >{children}</MR>
        ));

        render(AppElement);
        await waitFor(() => expect(document.querySelector('main.details-page')).toBeTruthy);
    });
    it('returns 404 for unknown path', async () => {
        BrowserRouter.mockImplementationOnce(({children}) => (
            <MR initialEntries={['/invalid']} >{children}</MR>
        ));

        render(AppElement);
        await screen.findByText('Uh-oh', {exact: false});
    });
    it('sets portal when handling a portal page', async () => {
        setPortalPrefix('');
        BrowserRouter.mockImplementationOnce(({children}) => (
            <MR initialEntries={['/landing-page']} >{children}</MR>
        ));
        render(AppElement);

        await waitFor(() => expect(setPortal).toHaveBeenCalledWith('landing-page'));
    });
    it('routes books routes to portal/books', async () => {
        setPortalPrefix('portal');
        BrowserRouter.mockImplementationOnce(({children}) => (
            <MR initialEntries={['/books/slug']} >{children}</MR>
        ));
        render(AppElement);
        // Nothing can really be checked; code coverage in rex-portal
    });
    it('renders nothing when data is null', async () => {
        setPortalPrefix('/landing-page');

        spyUpd.mockReturnValueOnce(null);
        BrowserRouter.mockImplementationOnce(({children}) => (
            <MR initialEntries={['/landing-page']} >{children}</MR>
        ));
        render(AppElement);

        await expect(screen.findByRole('link', {name: 'K12 resources'})).rejects.toThrow();
    });
    it('renders as a portal route', async () => {
        setPortalPrefix('/');

        BrowserRouter.mockImplementationOnce(({children}) => (
            <MR initialEntries={['/landing-page/contact']} >{children}</MR>
        ));
        render(AppElement);
        await waitFor(() => expect(setPortal).toHaveBeenCalledWith('landing-page'));
    });
    it('routes general page properly', async () => {
        setPortalPrefix('');
        BrowserRouter.mockImplementationOnce(({children}) => (
            <MR initialEntries={['/general-page']} >{children}</MR>
        ));

        render(AppElement);
        await waitFor(() => expect(spyGP).toHaveBeenCalled());
        spyGP.mockClear();
    });
    /* Below: tests that fail in strange ways */
    // it('renders as FlexPage when portal is properly set', async () => {
    //     setPortalPrefix('/landing-page');

    //     BrowserRouter.mockImplementationOnce(({children}) => (
    //         <MR initialEntries={['/landing-page']} >{children}</MR>
    //     ));
    //     render(AppElement);

    //     await screen.findByRole('link', {name: 'K12 resources'});
    // });
    // it('renders nothing when portal route data is null', async () => {
    //     setPortalPrefix('/landing-page');

    //     BrowserRouter.mockImplementationOnce(({children}) => (
    //         <MR initialEntries={['/landing-page/contact']} >{children}</MR>
    //     ));
    //     render(AppElement);
    //     await expect(screen.findByRole('form')).rejects.toThrow();
    // });
    // it('returns 404 for unknown portal path', async () => {
    //     BrowserRouter.mockImplementationOnce(({children}) => (
    //         <MR initialEntries={['/landing-page/invalid']} >{children}</MR>
    //     ));

    //     render(AppElement);
    //     await screen.findByText('Uh-oh', {exact: false});
    // });
    // it('loads flex pages that are not landing pages', async () => {
    //     setPortalPrefix('');
    //     BrowserRouter.mockImplementationOnce(({children}) => (
    //         <MR initialEntries={['/flex-page']} >{children}</MR>
    //     ));
    //     render(AppElement);
    //     await screen.findByRole('heading', {level: 2, name: 'Apply today to be an OpenStax Partner'});
    // });
    // it('loads flex page within a portal route', async () => {
    //     setPortalPrefix('/landing-page');
    //     BrowserRouter.mockImplementationOnce(({children}) => (
    //         <MR initialEntries={['/landing-page/flex-page']} >{children}</MR>
    //     ));
    //     render(AppElement);
    //     await screen.findByRole('heading', {level: 2, name: 'Apply today to be an OpenStax Partner'});
    // });
    // it('reroutes flex pages with extra path components to the page', async () => {
    //     setPortalPrefix('');
    //     BrowserRouter.mockImplementationOnce(({children}) => (
    //         <MR initialEntries={['/flex-page/extra/junk']} >{children}</MR>
    //     ));
    //     render(AppElement);
    //     await screen.findByRole('heading', {level: 2, name: 'Apply today to be an OpenStax Partner'});
    // });
    // it('loads general page within a portal route', async () => {
    //     setPortalPrefix('/landing-page');
    //     BrowserRouter.mockImplementationOnce(({children}) => (
    //         <MR initialEntries={['/landing-page/general-page']} >{children}</MR>
    //     ));
    //     render(AppElement);
    //     await waitFor(() => expect(spyGP).toHaveBeenCalled());
    //     spyGP.mockClear();
    // });
});
