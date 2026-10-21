import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import '@testing-library/jest-dom';
import {Routes, Route, useLocation} from 'react-router-dom';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import * as UPD from '~/helpers/use-page-data';
import {OtherPageRoutes} from '~/components/shell/router-helpers/page-routes';

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
    });
});

describe('page-routes: errata pages in a portal', () => {
    beforeEach(() => {
        mockUsePageData.mockReturnValue({...flexData, layout: [{type: 'landing'}]});
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
        mockUsePageData.mockReturnValue({...flexData, layout: [{type: 'landing'}]});
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
