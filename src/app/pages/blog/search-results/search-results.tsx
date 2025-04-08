import React from 'react';
import {useLocation} from 'react-router-dom';
import useBlogContext from '../blog-context';
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

function ArticleCard({
    article,
    isFirst
}: {
    article: ArticleSummaryData;
    isFirst: boolean;
}) {
    const {setPath} = useBlogContext();
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (isFirst) {
            ref?.current?.querySelector<HTMLAnchorElement>('a')?.focus();
        }
    }, [isFirst]);

    return (
        <div className="card" key={article.articleSlug} ref={ref}>
            <ArticleSummary {...{...article, setPath}} />
        </div>
    );
}

function VisibleArticles({articles}: {articles: ArticleSummaryData[]}) {
    const {setCurrentPage, visibleChildren, firstOnPage} =
        usePaginatorContext();
    const location = useLocation();

    React.useEffect(() => setCurrentPage(1), [location, setCurrentPage]);

    return visibleChildren(
        articles.map((article, i) => (
            <ArticleCard
                key={article.articleSlug}
                article={article}
                isFirst={i === firstOnPage}
            />
        ))
    );
}

export default function SearchResults() {
    const allArticles = useAllArticles();

    if (allArticles.length === 0) {
        return <NoResults />;
    }

    return (
        <div className="search-results">
            <PaginatorContextProvider
                contextValueParameters={{resultsPerPage: 10}}
            >
                <div className="boxed cards" aria-live="polite">
                    <VisibleArticles articles={allArticles} />
                </div>
                <PaginatorControls items={allArticles.length} />
            </PaginatorContextProvider>
        </div>
    );
}
