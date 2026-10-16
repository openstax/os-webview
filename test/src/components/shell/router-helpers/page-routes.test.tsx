import React from 'react';
import {act, render, screen, waitFor} from '@testing-library/preact';
import '@testing-library/jest-dom';
import {NavigateFunction, Routes, Route, useLocation, useNavigate} from 'react-router-dom';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import {initializeEventCapture, initializeGTM} from '~/helpers/tag-manager';
import * as UPD from '~/helpers/use-page-data';
import {OtherPageRoutes} from '~/components/shell/router-helpers/page-routes';
import type {SchoolData} from '~/pages/flex-page/flex-page';

jest.mock('~/helpers/tag-manager', () => ({
    initializeGTM: jest.fn(),
    initializeEventCapture: jest.fn()
}));

// The pages below were rebuilt as CMS FlexPages and their React components
// deleted. If the CMS stops returning a FlexPage for one of them, the route
// falls through to a dynamic import of a page that no longer exists.
jest.mock('~/pages/flex-page/flex-page', () => ({
    __esModule: true,
    ...jest.requireActual('~/pages/flex-page/flex-page'),
    default: () => <div data-testid="flex-page" />,
    LayoutUsingData: ({children}: {children: React.ReactNode}) => <>{children}</>
}));

const mockUsePageData = jest.spyOn(UPD, 'default');

const flexData = {
    meta: {type: 'pages.FlexPage', slug: 'x'},
    body: [],
    layout: [{type: 'default'}],
    schoolData: null
};

function Location() {
    const {pathname, search} = useLocation();

    return (
        <div data-testid="location" data-search={search}>
            {pathname}
        </div>
    );
}

function renderAt(path: string) {
    return render(
        <ShellContextProvider>
            <MemoryRouter initialEntries={[path]}>
                <Routes>
                    <Route path="/:dir/*" element={<OtherPageRoutes />} />
                </Routes>
                <Location />
            </MemoryRouter>
        </ShellContextProvider>
    );
}

describe('page-routes: pages now served by CMS FlexPages', () => {
    beforeEach(() => {
        mockUsePageData.mockReturnValue(flexData);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it.each(['about', 'assignable', 'faq', 'impact', 'research'])(
        'renders /%s as a FlexPage from pages/%s',
        async (dir) => {
            renderAt(`/${dir}`);

            expect(await screen.findByTestId('flex-page')).toBeInTheDocument();
            expect(mockUsePageData).toHaveBeenCalledWith(`pages/${dir}`, true);
        }
    );

    it.each([
        ['press', 'news'],
        ['foundation', 'supporters']
    ])('fetches /%s from the differently named CMS slug pages/%s', async (dir, slug) => {
        renderAt(`/${dir}`);

        expect(await screen.findByTestId('flex-page')).toBeInTheDocument();
        expect(mockUsePageData).toHaveBeenCalledWith(`pages/${slug}`, true);
        expect(mockUsePageData).not.toHaveBeenCalledWith(`pages/${dir}`, true);
    });

    it('redirects a trailing slash to the canonical URL, keeping the query string', async () => {
        renderAt('/press/?ref=nav');

        await waitFor(() => {
            expect(screen.getByTestId('location')).toHaveTextContent(/^\/press$/);
        });
        expect(screen.getByTestId('location')).toHaveAttribute('data-search', '?ref=nav');
        expect(await screen.findByTestId('flex-page')).toBeInTheDocument();
    });

    it('redirects a subpath of a non-portal FlexPage to its canonical URL', async () => {
        renderAt('/press/some-article');

        await waitFor(() => {
            expect(screen.getByTestId('location')).toHaveTextContent(/^\/press$/);
        });
    });

    it('renders the 404 page when the CMS has no such page', async () => {
        mockUsePageData.mockReturnValue({error: new Error('page not found')});

        renderAt('/about');

        expect(await screen.findByText('Uh-oh, no page here')).toBeInTheDocument();
        expect(initializeGTM).not.toHaveBeenCalled();
        expect(initializeEventCapture).not.toHaveBeenCalled();
    });
});

describe('page-routes: analytics', () => {
    function portalData(schoolData: SchoolData | null) {
        return {...flexData, layout: [{type: 'landing'}], schoolData};
    }

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('loads GTM for a page that is not a portal', async () => {
        mockUsePageData.mockReturnValue(flexData);

        renderAt('/about');

        await waitFor(() => expect(initializeGTM).toHaveBeenCalled());
        expect(initializeEventCapture).not.toHaveBeenCalled();
    });

    it.each([
        ['a portal with no school', null],
        ['a non-K12 school', {industry: 'Higher Education', salesforceId: 'sf-id', researchAgreementActive: true}]
    ])('loads GTM for %s', async (_, schoolData) => {
        mockUsePageData.mockReturnValue(portalData(schoolData));

        renderAt('/a-portal');

        await waitFor(() => expect(initializeGTM).toHaveBeenCalled());
        expect(initializeEventCapture).not.toHaveBeenCalled();
    });

    it('loads nothing for a K12 school without a research agreement', async () => {
        mockUsePageData.mockReturnValue(
            portalData({industry: 'K12', salesforceId: 'sf-id', researchAgreementActive: false})
        );

        renderAt('/a-portal');

        expect(await screen.findByTestId('flex-page')).toBeInTheDocument();
        expect(initializeGTM).not.toHaveBeenCalled();
        expect(initializeEventCapture).not.toHaveBeenCalled();
    });

    it('loads event capture, not GTM, for a K12 school with a research agreement', async () => {
        mockUsePageData.mockReturnValue(
            portalData({industry: 'K12', salesforceId: 'sf-id', researchAgreementActive: true})
        );

        renderAt('/a-portal');

        await waitFor(() => expect(initializeEventCapture).toHaveBeenCalledWith('sf-id'));
        expect(initializeGTM).not.toHaveBeenCalled();
    });

    it('uses the new portal\'s school after navigating from another portal', () => {
        const dataBySlug: Record<string, ReturnType<typeof portalData>> = {
            'pages/portal-a': portalData({industry: 'K12', salesforceId: 'sf-a', researchAgreementActive: false}),
            'pages/portal-b': portalData({industry: 'K12', salesforceId: 'sf-b', researchAgreementActive: true})
        };
        const loadBySlug: Record<string, () => void> = {};

        // Like the real hook, keeps returning the previous page's data until the new page's data loads
        function useStalePageData(slug: string) {
            const [data, setData] = React.useState<ReturnType<typeof portalData>>();

            React.useEffect(() => {
                loadBySlug[slug] = () => setData(dataBySlug[slug]);
            }, [slug]);

            return data;
        }
        let navigate: NavigateFunction;

        function Navigator() {
            navigate = useNavigate();
            return null;
        }

        mockUsePageData.mockImplementation(useStalePageData as unknown as typeof UPD.default);
        render(
            <ShellContextProvider>
                <MemoryRouter initialEntries={['/portal-a']}>
                    <Routes>
                        <Route path="/:dir/*" element={<OtherPageRoutes />} />
                    </Routes>
                    <Navigator />
                </MemoryRouter>
            </ShellContextProvider>
        );

        act(() => loadBySlug['pages/portal-a']());
        act(() => navigate('/portal-b'));

        // Portal B's data has not loaded, so the page still has portal A's
        expect(initializeEventCapture).not.toHaveBeenCalled();

        act(() => loadBySlug['pages/portal-b']());

        expect(initializeEventCapture).toHaveBeenCalledWith('sf-b');
        expect(initializeGTM).not.toHaveBeenCalled();
    });
});
