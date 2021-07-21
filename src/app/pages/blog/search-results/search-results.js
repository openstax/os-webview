import React, {useState, useEffect} from 'react';
import {fetchFromCMS} from '~/helpers/controller/cms-mixin';
import uniqBy from 'lodash/uniqBy';
import BlogContext from '../blog-context';
import ArticleSummary, {blurbModel} from '../article-summary/article-summary';
import $ from '~/helpers/$';
import analytics from '~/helpers/analytics';
import {PaginatedResults, PaginatorControls} from '~/components/paginator/paginator.js';
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


export default function SearchResults() {
    const {location, setPath} = React.useContext(BlogContext);
    const allArticles = useAllArticles(location);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => setCurrentPage(1), [location]);

    return (
        <div className="search-results">
            <PaginatedResults currentPage={currentPage}>
                {
                    allArticles.map((article) =>
                        <div className="card" key={article.articleSlug}>
                            <ArticleSummary {...{...article, setPath}} key={article.slug} />
                        </div>
                    )
                }
            </PaginatedResults>
            <PaginatorControls
                items={allArticles.length}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}
