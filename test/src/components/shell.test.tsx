import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AppElement from '~/components/shell/shell';
import * as RRD from 'react-router-dom';
import MR from '~/../../test/helpers/future-memory-router';
import * as UPD from '~/helpers/use-page-data';
import * as PC from '~/contexts/portal';
import * as GP from '~/pages/general/general';
import * as LDH from '~/layouts/default/header/header';
import * as MM from '~/layouts/default/header/menus/menus';
import * as MSP from '~/layouts/default/microsurvey-popup/microsurvey-popup';
import * as TD from '~/layouts/default/takeover-dialog/takeover-dialog';
import * as LSN from '~/layouts/default/lower-sticky-note/lower-sticky-note';
import * as DH from '~/helpers/use-document-head';
import * as UC from '~/contexts/user';
import {camelCaseKeys, transformData} from '~/helpers/page-data-utils';
import landingPage from '../data/landing-page';
import contactPage from '../data/contact-page';
import formHeadings from '../data/form-headings';
import homePage from '../data/home-page';
import subjectPage from '../data/new-subjects';
import flexPage from '../data/flex-page';
import generalPage from '../data/general-page';
import footerPageTos from '../data/footer-page-tos';
import ChildrenContainer from '~/../../test/helpers/mock-children-container';

const {useLocation} = RRD;
const BrowserRouter = jest.spyOn(RRD, 'BrowserRouter').mockImplementation(({children}) => (
    <MR initialEntries={['/']}><div id="main">{children}</div></MR>
));

function mockBrowserInitialEntries(entries: string[]) {
    BrowserRouter.mockImplementationOnce(({children}) => (
        <MR initialEntries={entries} >
            {children}
        </MR>
    ));
}

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
    function mockBrowserInitialEntriesWithLocation(entries: string[]) {
        BrowserRouter.mockImplementationOnce(({children}) => (
            <MR initialEntries={entries} >
                {children}
                <LocationDisplay />
            </MR>
        ));
    }

    // eslint-disable-next-line complexity
    const spyUpd = jest.spyOn(UPD, 'default').mockImplementation((path) => {
        switch (path) {
            case 'pages/form-headings?locale=en':
                return camelCaseKeys(formHeadings);
            case 'pages/landing-page':
                return camelCaseKeys(landingPage);
            case 'pages/flex-page':
                // @ts-expect-error flexPage type
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
            case 'pages/tos':
                return camelCaseKeys(transformData(footerPageTos));
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

    type WindowWithPiTracker = (typeof window) & {
        piTracker: (path: string) => void;
    }
    const w = window as WindowWithPiTracker;
    const piTracker = jest.fn();

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
        jest.spyOn(TD, 'default').mockReturnValue(null);
        jest.spyOn(LSN, 'default').mockReturnValue(null);
        jest.spyOn(DH, 'default').mockReturnValue(undefined);
        jest.spyOn(DH, 'setPageDescription').mockReturnValue(undefined);
        jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData').mockReturnValue(undefined);
        jest.spyOn(UC, 'UserContextProvider').mockImplementation(ChildrenContainer);
        jest.spyOn(UC, 'default').mockReturnValue({} as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    });

    afterEach(() => {
        setPortal.mockClear();
    });

    it('(skip to main content link) works', async () => {
        window.scrollBy = jest.fn();
        mockBrowserInitialEntries(['/']);
        render(AppElement);
        const skipLink = await screen.findByRole('link', {name: 'skip to main content'});

        await user.click(skipLink);
        await waitFor(() => expect(window.scrollBy).toHaveBeenCalled());
    });
    it('Delivers embedded contact page', async () => {
        mockBrowserInitialEntries(['/embedded/contact']);
        spyUpd.mockReturnValueOnce(null);

        render(AppElement);
        await screen.findByText('What is your question about?');
        expect(screen.queryAllByRole('navigation')).toHaveLength(0);
    });
    it('routes "home/anything" to top-level', async () => {
        mockBrowserInitialEntriesWithLocation(['/home/anything']);

        render(AppElement);
        await screen.findByText('-/-');
    });
    it('routes "general/anything" to "/anything"', async () => {
        mockBrowserInitialEntriesWithLocation(['/general/anything']);

        render(AppElement);
        await screen.findByText('-/anything-');
    });
    it('routes adoption (no CMS page data) page', async () => {
        mockBrowserInitialEntries(['/adoption']);

        render(AppElement);
        await screen.findByRole('combobox');
        await screen.findByText('Let us know you\'re using OpenStax');
    });
    it('sets portal before routing to page in a portal', async () => {
        w.piTracker = (path: string) => piTracker(path);
        setPortalPrefix('');
        mockBrowserInitialEntries(['/landing-page/adoption']);
        render(AppElement);

        await waitFor(() => expect(setPortal).toHaveBeenCalledWith('landing-page'));
        await waitFor(() => expect(piTracker).toHaveBeenCalled());
    });

    it('routes adoption (no CMS page data) page when in portal', async () => {
        setPortalPrefix('/landing-page');
        mockBrowserInitialEntries(['/landing-page/adoption']);

        render(AppElement);

        await screen.findByRole('combobox');
        await screen.findByText('Let us know you\'re using OpenStax');
    });
    it('routes "errata" paths', async () => {
        mockBrowserInitialEntries(['/errata']);

        render(AppElement);
        await screen.findByText('No book or errata ID selected');
    });
    it('routes "details" paths (top level routes to Subjects)', async () => {
        mockBrowserInitialEntries(['/details']);

        render(AppElement);
        await screen.findByRole('heading', {level: 1, name: 'Browse our subjects'});
    });
    it('routes "books/*" to details', async () => {
        mockBrowserInitialEntries(['/books/some-book']);

        render(AppElement);
        await waitFor(() => expect(document.querySelector('main.details-page')).toBeTruthy);
    });
    it('routes "books" to 404', async () => {
        mockBrowserInitialEntries(['/books']);

        render(AppElement);
        await waitFor(() => expect(document.querySelector('main.details-page')).toBeTruthy);
    });
    it('returns 404 for unknown path', async () => {
        mockBrowserInitialEntries(['/invalid']);

        render(AppElement);
        await screen.findByText('Uh-oh', {exact: false});
    });
    it('routes general page to fetch spike/slug', async () => {
        mockBrowserInitialEntries(['/general-page']);
        render(AppElement);
        await screen.findByText('Loaded page ""');
    });
    it('sets portal when handling a portal page', async () => {
        setPortalPrefix('');
        mockBrowserInitialEntries(['/landing-page']);
        render(AppElement);

        await waitFor(() => expect(setPortal).toHaveBeenCalledWith('landing-page'));
    });
    it('renders nothing when data is null', async () => {
        setPortalPrefix('/landing-page');

        spyUpd.mockReturnValueOnce(null);
        mockBrowserInitialEntries(['/landing-page']);
        render(AppElement);

        await expect(screen.findByRole('link', {name: 'K12 resources'})).rejects.toThrow();
    });
    it('renders page within a portal route', async () => {
        setPortalPrefix('/');

        mockBrowserInitialEntries(['/landing-page/contact']);
        render(AppElement);
        await waitFor(() => expect(setPortal).toHaveBeenCalledWith('landing-page'));
    });
    // -- Warnings are generated from failed reads
    it('renders as a portal route with nothing beyond the portal', async () => {
        setPortalPrefix('/landing-page');

        mockBrowserInitialEntries(['/landing-page/']);
        render(AppElement);
        await screen.findByText('Loaded page ""');
    });
        it('renders page within a portal route', async () => {
        setPortalPrefix('/');

        mockBrowserInitialEntries(['/landing-page/contact']);
        render(AppElement);
        await waitFor(() => expect(setPortal).toHaveBeenCalledWith('landing-page'));
    });
    it('renders ordinary page through portal', async () => {
        setPortalPrefix('/landing-page');

        mockBrowserInitialEntries(['/landing-page/contact']);
        render(AppElement);
        expect(await screen.findByText('What is your question about?')).toBeInTheDocument();
    });
    it('returns 404 for unknown portal path', async () => {
        setPortalPrefix('/landing-page');

        mockBrowserInitialEntries(['/landing-page/invalid']);
        render(AppElement);
        await screen.findByText('Uh-oh, no page here');
    });
    it('loads flex page within a portal route', async () => {
        setPortalPrefix('/landing-page');
        mockBrowserInitialEntries(['/landing-page/flex-page']);
        render(AppElement);
        await screen.findByRole('heading', {level: 2, name: 'Apply today to be an OpenStax Partner'});
    });
    it('reroutes flex pages with extra path components to the page', async () => {
        setPortalPrefix('');
        mockBrowserInitialEntries(['/flex-page/extra/junk']);
        render(AppElement);
        await screen.findByRole('heading', {level: 2, name: 'Apply today to be an OpenStax Partner'});
    });
    it('loads general page within a portal route', async () => {
        setPortalPrefix('/landing-page');
        mockBrowserInitialEntries(['/landing-page/general-page']);
        render(AppElement);
        await waitFor(() => expect(spyGP).toHaveBeenCalled());
        spyGP.mockClear();
    });
    it('routes footer page (tos) at top level', async () => {
        setPortalPrefix('');
        mockBrowserInitialEntries(['/tos/']);
        render(AppElement);
        await screen.findByRole('heading', {level: 1, name: 'Terms of Service'});
    });
    it('routes footer page (tos) within a portal route', async () => {
        setPortalPrefix('/landing-page');
        mockBrowserInitialEntries(['/landing-page/tos/']);
        render(AppElement);
        await screen.findByRole('heading', {level: 1, name: 'Terms of Service'});
    });
    it('does not fall through to generic portal flex page for footer pages', async () => {
        setPortalPrefix('/landing-page');
        mockBrowserInitialEntries(['/landing-page/license/']);
        render(AppElement);
        // Should render footer-page component, not the portal flex page
        // The footer page component should be attempting to load pages/license
        await waitFor(() => expect(spyUpd).toHaveBeenCalledWith('pages/license'));
    });
});
