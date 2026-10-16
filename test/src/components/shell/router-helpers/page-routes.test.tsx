import React from 'react';
import {FetchState, fetchError, fetchLoading, fetchSuccess} from '@openstax/ts-utils/fetch';
import {act, render, screen, waitFor} from '@testing-library/preact';
import '@testing-library/jest-dom';
import {NavigateFunction, Routes, Route, useLocation, useNavigate} from 'react-router-dom';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import * as PageLoaders from '~/components/shell/router-helpers/page-loaders';
import * as PageDataUtils from '~/helpers/page-data-utils';
import {initializeAnalytics} from '~/helpers/tag-manager';
import * as UPD from '~/helpers/use-page-data';
import {OtherPageRoutes} from '~/components/shell/router-helpers/page-routes';
import type {SchoolData} from '~/pages/flex-page/flex-page';

jest.mock('~/helpers/tag-manager', () => ({
    initializeAnalytics: jest.fn()
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

const realUsePageDataFetchState = UPD.usePageDataFetchState;
const mockUsePageDataFetchState = jest.spyOn(UPD, 'usePageDataFetchState');
const fetchFromCMS = jest.spyOn(PageDataUtils, 'fetchFromCMS');

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
        mockUsePageDataFetchState.mockReturnValue(fetchSuccess(flexData));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it.each(['about', 'assignable', 'faq', 'impact', 'research'])(
        'renders /%s as a FlexPage from pages/%s',
        async (dir) => {
            renderAt(`/${dir}`);

            expect(await screen.findByTestId('flex-page')).toBeInTheDocument();
            expect(mockUsePageDataFetchState).toHaveBeenCalledWith(`pages/${dir}`, true);
        }
    );

    it.each([
        ['press', 'news'],
        ['foundation', 'supporters']
    ])('fetches /%s from the differently named CMS slug pages/%s', async (dir, slug) => {
        renderAt(`/${dir}`);

        expect(await screen.findByTestId('flex-page')).toBeInTheDocument();
        expect(mockUsePageDataFetchState).toHaveBeenCalledWith(`pages/${slug}`, true);
        expect(mockUsePageDataFetchState).not.toHaveBeenCalledWith(`pages/${dir}`, true);
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
        mockUsePageDataFetchState.mockReturnValue(fetchSuccess({error: new Error('page not found')}));

        renderAt('/about');

        expect(await screen.findByText('Uh-oh, no page here')).toBeInTheDocument();
        expect(initializeAnalytics).not.toHaveBeenCalled();
    });
});

describe('page-routes: analytics', () => {
    const schoolData = {industry: 'K12', salesforceId: 'sf-id', researchAgreementActive: true};

    function portalData(portalSchoolData: SchoolData | null) {
        return {...flexData, layout: [{type: 'landing'}], schoolData: portalSchoolData};
    }

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('loads analytics for no school on a page that is not a portal', async () => {
        mockUsePageDataFetchState.mockReturnValue(fetchSuccess({...flexData, schoolData}));

        renderAt('/about');

        await waitFor(() => expect(initializeAnalytics).toHaveBeenCalledWith(null));
    });

    it('loads analytics for a portal\'s school', async () => {
        mockUsePageDataFetchState.mockReturnValue(fetchSuccess(portalData(schoolData)));

        renderAt('/a-portal');

        await waitFor(() => expect(initializeAnalytics).toHaveBeenCalledWith(schoolData));
    });

    describe('portal sub-pages', () => {
        const importedPage = jest.spyOn(PageLoaders, 'ImportedPage').mockImplementation(
            ({name}) => <div data-testid="imported-page">{name}</div>
        );

        function renderSubPageWith(subPageData: FetchState<never, Error>) {
            mockUsePageDataFetchState.mockImplementation(((slug: string) => slug === 'pages/a-portal'
                ? fetchSuccess(portalData(null))
                : subPageData
            ) as unknown as typeof UPD.usePageDataFetchState);

            renderAt('/a-portal/sub-page');
        }

        afterAll(() => {
            importedPage.mockRestore();
        });

        // Importing by name before knowing whether the CMS has the page could
        // flash a 404 for a page that only exists in the CMS
        it('renders nothing while the sub-page\'s data loads', async () => {
            renderSubPageWith(fetchLoading());

            await waitFor(() => {
                expect(mockUsePageDataFetchState).toHaveBeenCalledWith('pages/sub-page', true);
            });
            expect(importedPage).not.toHaveBeenCalled();
        });

        it('falls back to the imported page when the sub-page\'s data fails to load', async () => {
            renderSubPageWith(fetchError(new Error('CMS is down')));

            expect(await screen.findByTestId('imported-page')).toHaveTextContent('sub-page');
        });
    });

    it('uses the new portal\'s school after navigating from another portal', async () => {
        const resolveBySlug: Record<string, (data: ReturnType<typeof portalData>) => void> = {};
        let navigate: NavigateFunction;

        function Navigator() {
            navigate = useNavigate();
            return null;
        }

        // The real hook, so that the previous portal's data is kept while the next one loads
        mockUsePageDataFetchState.mockImplementation(realUsePageDataFetchState);
        fetchFromCMS.mockImplementation(
            (slug: string) => new Promise((resolve) => {
                resolveBySlug[slug] = resolve;
            })
        );
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

        const portalASchool = {industry: 'K12', salesforceId: 'sf-a', researchAgreementActive: false};
        const portalBSchool = {industry: 'K12', salesforceId: 'sf-b', researchAgreementActive: true};

        act(() => resolveBySlug['pages/portal-a'](portalData(portalASchool)));
        expect(await screen.findByTestId('flex-page')).toBeInTheDocument();
        expect(initializeAnalytics).toHaveBeenLastCalledWith(portalASchool);

        act(() => navigate('/portal-b'));

        // Portal B's data has not loaded, so portal A's page is not shown under B
        // and its school is not used again
        expect(screen.queryByTestId('flex-page')).not.toBeInTheDocument();
        expect(initializeAnalytics).toHaveBeenCalledTimes(1);

        act(() => resolveBySlug['pages/portal-b'](portalData(portalBSchool)));

        // initializeAnalytics reloads the page, since portal B needs different analytics
        await waitFor(() => expect(initializeAnalytics).toHaveBeenLastCalledWith(portalBSchool));
    });
});
