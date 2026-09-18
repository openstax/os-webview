import React from 'react';
import {useLocation} from 'react-router-dom';
import useBlogContext from '../blog-context';
import useBlogSearchParams from '../use-blog-search-params';
import ArticleSummary, {
    ArticleSummaryData
} from '../article-summary/article-summary';
import usePaginatorContext, {
    PaginatorContextProvider
} from '~/components/paginator/paginator-context';
import {PaginatorControls} from '~/components/paginator/search-results/paginator';
import NoResults from './no-results';
import useAllArticles from './use-all-articles';
import './search-results.scss';

function ArticleCard({article}: {article: ArticleSummaryData}) {
    const {setPath} = useBlogContext();

    return (
        <div className="card" key={article.articleSlug}>
            <ArticleSummary {...{...article, setPath}} />
        </div>
    );
}

function statusMessage(isLoading: boolean, count: number) {
    if (isLoading) {
        return 'Searching blog posts';
    }
    if (count === 0) {
        return 'Your search returned no blog posts';
    }
    return `${count} blog ${count === 1 ? 'post' : 'posts'} found`;
}

function ResultsForPage() {
    const {currentPage, resultsPerPage, setCurrentPage} = usePaginatorContext();
    const {articles, isLoading, total} = useAllArticles(currentPage, resultsPerPage);
    const {q} = useBlogSearchParams();
    const location = useLocation();
    const regionRef = React.useRef<HTMLDivElement>(null);
    const focusedForQuery = React.useRef<string | undefined>(undefined);

    // Reset to page 1 whenever the query or facets change. Page clicks are
    // local paginator state and never touch the URL, so a location change
    // always means a new search, not just a page turn.
    React.useEffect(() => setCurrentPage(1), [location, setCurrentPage]);

    // Move focus to the first result only when the search query changes (an
    // explicit search), never when a facet is toggled. Yanking focus on a
    // facet change would pull keyboard/screen-reader users out of the filter
    // bar (WCAG 3.2.2 On Input).
    React.useEffect(() => {
        if (isLoading || articles.length === 0 || focusedForQuery.current === q) {
            return;
        }
        focusedForQuery.current = q;
        regionRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    }, [isLoading, articles, q]);

    const showNoResults = !isLoading && articles.length === 0;

    return (
        <div className="search-results" ref={regionRef} aria-busy={isLoading}>
            <div className="sr-only" role="status" aria-live="polite">
                {statusMessage(isLoading, total)}
            </div>
            {showNoResults && <NoResults />}
            {articles.length > 0 && (
                <React.Fragment>
                    <div className="boxed cards">
                        {articles.map((article) => (
                            <ArticleCard key={article.articleSlug} article={article} />
                        ))}
                    </div>
                    <PaginatorControls items={total} />
                </React.Fragment>
            )}
        </div>
    );
}

export default function SearchResults() {
    return (
        <PaginatorContextProvider contextValueParameters={{resultsPerPage: 10}}>
            <ResultsForPage />
        </PaginatorContextProvider>
    );
}
