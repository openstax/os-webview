import React, {useState, useEffect} from 'react';
import {fetchFromCMS} from '~/helpers/controller/cms-mixin';
import uniqBy from 'lodash/uniqBy';
import useBlogContext from '../blog-context';
import ArticleSummary, {blurbModel} from '../article-summary/article-summary';
import $ from '~/helpers/$';
import analytics from '~/helpers/analytics';
import usePaginatorContext, {PaginatorContextProvider} from '~/components/paginator/paginator-context';
import {PaginatorControls} from '~/components/paginator/search-results/paginator.js';
import './search-results.scss';

function useAllArticles(location) {
    const [allArticles, setAllArticles] = useState([]);
    const searchParam = location.search.substr(1);

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
                            return blurbModel($.camelCaseKeys(data));
                        })
                );
            });
    }, [searchParam]);

    return allArticles;
}

function VisibleArticles({articles}) {
    const {setCurrentPage, visibleChildren} = usePaginatorContext();
    const {location, setPath} = useBlogContext();

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
    const {location} = useBlogContext();
    const allArticles = useAllArticles(location);

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
