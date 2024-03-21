import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {fetchFromCMS, camelCaseKeys} from '~/helpers/page-data-utils';
import uniqBy from 'lodash/uniqBy';
import useBlogContext from '../blog-context';
import ArticleSummary, {blurbModel} from '../article-summary/article-summary';
import usePaginatorContext, {
    PaginatorContextProvider
} from '~/components/paginator/paginator-context';
import {PaginatorControls} from '~/components/paginator/search-results/paginator.js';
import NoResults from './no-results';
import './search-results.scss';

function useAllArticles() {
    const {search} = useLocation();
    const searchParam = new window.URLSearchParams(search).get('q');
    const [allArticles, setAllArticles] = useState([]);

    useEffect(() => {
        const slug = `search/?q=${searchParam}`;

        setAllArticles([]);
        fetchFromCMS(slug, true).then((results) => {
            setAllArticles(
                uniqBy(results, 'id').map((data) => {
                    data.heading = data.title;
                    delete data.subheading;
                    return blurbModel(camelCaseKeys(data));
                })
            );
        });
    }, [searchParam]);

    return allArticles;
}

function ArticleCard({article, isFirst}) {
    const {setPath} = useBlogContext();
    const ref = React.useRef();

    React.useEffect(() => {
        if (isFirst) {
            ref.current.querySelector('a').focus();
        }
    }, [isFirst]);

    return (
        <div className="card" key={article.articleSlug} ref={ref}>
            <ArticleSummary {...{...article, setPath}} />
        </div>
    );
}

function VisibleArticles({articles}) {
    const {setCurrentPage, visibleChildren, firstOnPage} =
        usePaginatorContext();
    const location = useLocation();

    useEffect(() => setCurrentPage(1), [location, setCurrentPage]);

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
