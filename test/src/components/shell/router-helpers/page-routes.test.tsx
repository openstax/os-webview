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

// Shows which page a route imports, and the rest of the path that the page's
// own routes would match, without loading the page
jest.mock('~/components/shell/router-helpers/page-loaders', () => {
    const {useParams} = jest.requireActual('react-router-dom');

    return {
        __esModule: true,
        ...jest.requireActual('~/components/shell/router-helpers/page-loaders'),
        ImportedPage: ({name}: {name: string}) => (
            <div data-testid="imported-page" data-rest={useParams()['*']}>{name}</div>
        )
    };
});

const realUsePageDataFetchState = UPD.usePageDataFetchState;
const mockUsePageDataFetchState = jest.spyOn(UPD, 'usePageDataFetchState');
const fetchFromCMS = jest.spyOn(PageDataUtils, 'fetchFromCMS');

const flexData = {
    meta: {type: 'pages.FlexPage', slug: 'x'},
    body: [],
    layout: [{type: 'default'}],
    schoolData: null
};
// Only K12 school portals keep readers in the portal
const k12PortalData = {...flexData, layout: [{type: 'landing'}], schoolData: {industry: 'K12'}};

function Location() {
    const {pathname, search, hash} = useLocation();

    return (
        <div data-testid="location" data-search={search} data-hash={hash}>
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

    it('redirects a trailing slash to the canonical URL, keeping the query string and fragment', async () => {
        renderAt('/press/?ref=nav#contacts');

        await waitFor(() => {
            expect(screen.getByTestId('location')).toHaveTextContent(/^\/press$/);
        });
        expect(screen.getByTestId('location')).toHaveAttribute('data-search', '?ref=nav');
        expect(screen.getByTestId('location')).toHaveAttribute('data-hash', '#contacts');
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

        await waitFor(() => expect(initializeAnalytics).toHaveBeenLastCalledWith(portalBSchool));
    });
});

describe('page-routes: page names with escapes', () => {
    beforeEach(() => {
        mockUsePageDataFetchState.mockReturnValue(fetchSuccess(k12PortalData));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        ['/%6Dy-portal/errata/7199', '/my-portal/errata/7199', 'errata-detail'],
        ['/%6Dy-portal/confirmation/contact', '/my-portal/confirmation/contact', 'confirmation'],
        ['/%6Dy-portal/blog/some%2Farticle', '/my-portal/blog/some%2Farticle', 'blog']
    ])('redirects %s to %s once, keeping the rest of the path as it was', async (path, destination, page) => {
        renderAt(`${path}?ref=nav#top`);

        // The page renders at the plain portal name, so the redirect has settled
        expect(await screen.findByTestId('imported-page')).toHaveTextContent(page);
        expect(screen.getByTestId('location')).toHaveTextContent(new RegExp(`^${destination}$`));
        expect(screen.getByTestId('location')).toHaveAttribute('data-search', '?ref=nav');
    });
});

describe('page-routes: redirects in a portal', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        ['/my-portal/general/online-resources', '/my-portal/online-resources'],
        ['/my-portal/home/major-funders', '/my-portal'],
        ['/my-portal/textbooks/biology', '/my-portal/details/books/biology'],
        ['/my-portal/books/biology', '/my-portal/details/books/biology'],
        ['/my-portal/books/biology/', '/my-portal/details/books/biology'],
        ['/my-portal/details', '/my-portal/subjects']
    ])('redirects %s to %s in a K12 portal, keeping the query string and fragment', async (path, destination) => {
        mockUsePageDataFetchState.mockReturnValue(fetchSuccess(k12PortalData));
        renderAt(`${path}?ref=nav#faq`);

        await waitFor(() => {
            expect(screen.getByTestId('location')).toHaveTextContent(new RegExp(`^${destination}$`));
        });
        expect(screen.getByTestId('location')).toHaveAttribute('data-search', '?ref=nav');
        expect(screen.getByTestId('location')).toHaveAttribute('data-hash', '#faq');
    });

    it.each([
        ['/my-portal/books/biology', '/details/books/biology'],
        ['/my-portal/details', '/subjects']
    ])('redirects %s out of a portal that is not K12, to %s', async (path, destination) => {
        mockUsePageDataFetchState.mockReturnValue(fetchSuccess({...flexData, layout: [{type: 'landing'}]}));
        renderAt(path);

        await waitFor(() => {
            expect(screen.getByTestId('location')).toHaveTextContent(new RegExp(`^${destination}$`));
        });
    });
});

describe('page-routes: redirects outside a portal', () => {
    beforeEach(() => {
        mockUsePageDataFetchState.mockReturnValue(fetchSuccess(flexData));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        ['/general/online-resources', '/online-resources'],
        ['/home/major-funders', '/']
    ])('redirects %s to %s, keeping the query string and fragment', async (path, destination) => {
        renderAt(`${path}?ref=nav#faq`);

        await waitFor(() => {
            expect(screen.getByTestId('location')).toHaveTextContent(new RegExp(`^${destination}$`));
        });
        expect(screen.getByTestId('location')).toHaveAttribute('data-search', '?ref=nav');
        expect(screen.getByTestId('location')).toHaveAttribute('data-hash', '#faq');
    });
});

describe('page-routes: k12 subject pages in a portal', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        ['/my-portal/k12/algebra', 'algebra'],
        ['/my-portal/k12/algebra/', 'algebra/']
    ])('routes %s through the k12 page, which routes the subject', async (path, rest) => {
        // Old-style subject pages are neither FlexPages nor general pages
        mockUsePageDataFetchState.mockImplementation(((slug: string) => fetchSuccess(slug === 'pages/my-portal'
            ? {...flexData, layout: [{type: 'landing'}]}
            : {meta: {type: 'pages.K12Subject', slug: 'k12-algebra'}})
        ) as unknown as typeof UPD.usePageDataFetchState);

        renderAt(path);

        const page = await screen.findByTestId('imported-page');

        expect(mockUsePageDataFetchState).toHaveBeenCalledWith('pages/k12-algebra', true);
        expect(page).toHaveTextContent('k12');
        expect(page).toHaveAttribute('data-rest', rest);
    });
});

describe('page-routes: page names with decoded characters a slug cannot have', () => {
    beforeEach(() => {
        // Any fetched page would be a portal, which is the case that must not happen
        mockUsePageDataFetchState.mockReturnValue(fetchSuccess({...flexData, layout: [{type: 'landing'}]}));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        '/%2Fevil.example%2F..%2F..%2Fmy-portal/subjects',
        '/%5Cevil.example%2F..%2F..%2Fmy-portal/subjects',
        '/%09my-portal/subjects',
        '/my-portal%0A/subjects',
        '/my-portal%0D/subjects'
    ])('renders %s as not found, without fetching page data', async (path) => {
        renderAt(path);

        expect(await screen.findByText('Uh-oh, no page here')).toBeInTheDocument();
        expect(mockUsePageDataFetchState).not.toHaveBeenCalled();
    });

    it('renders a portal sub-page with one as not found', async () => {
        renderAt('/my-portal/%2Fevil.example');

        expect(await screen.findByText('Uh-oh, no page here')).toBeInTheDocument();
    });
});

describe('page-routes: errata pages in a portal', () => {
    beforeEach(() => {
        mockUsePageDataFetchState.mockReturnValue(fetchSuccess({...flexData, layout: [{type: 'landing'}]}));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        ['/my-portal/errata/?book=Some%20Book', 'errata-summary'],
        ['/my-portal/errata/form?book=Some%20Book', 'errata-form'],
        ['/my-portal/errata/7199', 'errata-detail'],
        ['/my-portal/confirmation/errata?id=7199', 'confirmation']
    ])('renders %s with the %s page', async (path, page) => {
        renderAt(path);

        expect(await screen.findByTestId('imported-page')).toHaveTextContent(page);
    });
});

describe('page-routes: blog pages in a portal', () => {
    beforeEach(() => {
        mockUsePageDataFetchState.mockReturnValue(fetchSuccess({...flexData, layout: [{type: 'landing'}]}));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        ['/my-portal/blog', ''],
        ['/my-portal/blog/some-article', 'some-article'],
        ['/my-portal/blog/explore/subjects/Math', 'explore/subjects/Math']
    ])('renders %s with the blog page, which routes %j itself', async (path, rest) => {
        renderAt(path);

        const page = await screen.findByTestId('imported-page');

        expect(page).toHaveTextContent('blog');
        expect(page).toHaveAttribute('data-rest', rest);
    });
});
