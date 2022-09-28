import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {fetchFromCMS, camelCaseKeys} from '~/helpers/page-data-utils';
import uniqBy from 'lodash/uniqBy';
import useBlogContext from '../blog-context';
import ArticleSummary, {blurbModel} from '../article-summary/article-summary';
import analytics from '~/helpers/analytics';
import usePaginatorContext, {PaginatorContextProvider} from '~/components/paginator/paginator-context';
import {PaginatorControls} from '~/components/paginator/search-results/paginator.js';
import './search-results.scss';

function useAllArticles() {
    const {search} = useLocation();
    const [allArticles, setAllArticles] = useState([]);
    const searchParam = search.substr(1);

    analytics.sendPageEvent('Blog search', decodeURIComponent(searchParam));
    useEffect(() => {
        const slug = `search/?q=${searchParam}`;

        setAllArticles([]);
        fetchFromCMS(slug, true)
            .then((results) => {
                setAllArticles(
                    uniqBy(results, 'id')
                        .map((data) => {
                            data.heading = data.title;
                            delete data.subheading;
                            return blurbModel(camelCaseKeys(data));
                        })
                );
            });
    }, [searchParam]);

    return allArticles;
}

function VisibleArticles({articles}) {
    const {setCurrentPage, visibleChildren} = usePaginatorContext();
    const {setPath} = useBlogContext();
    const location = useLocation();

    useEffect(() => setCurrentPage(1), [location, setCurrentPage]);

    return visibleChildren(
        articles.map(
            (article) =>
                <div className="card" key={article.articleSlug}>
                    <ArticleSummary {...{...article, setPath}} key={article.slug} />
                </div>
        )
    );
}

export default function SearchResults() {
    const allArticles = useAllArticles();

    return (
        <div className="search-results">
            <PaginatorContextProvider contextValueParameters={{resultsPerPage: 10}}>
                <div className="boxed cards">
                    <VisibleArticles articles={allArticles} />
                </div>
                <PaginatorControls items={allArticles.length} />
            </PaginatorContextProvider>
        </div>
    );
}
