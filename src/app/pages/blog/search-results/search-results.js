import React, {useState, useEffect} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {fetchFromCMS} from '~/helpers/controller/cms-mixin';
import uniqBy from 'lodash/uniqBy';
import {ArticleSummary, blurbModel} from '../article-summary/article-summary.jsx';
import analytics from '~/helpers/analytics';
import {PaginatedResults, PaginatorControls} from '~/components/paginator/paginator.js';
import './search-results.css';

function useAllArticles(location) {
    const [allArticles, setAllArticles] = useState([]);
    const searchParam = location.search.substr(1);
    const slug = `search/?q=${searchParam}`;

    analytics.sendPageEvent('Blog search', decodeURIComponent(searchParam));
    useEffect(() => {
        fetchFromCMS(slug, true)
            .then((results) => {
                setAllArticles(uniqBy(results, 'id')
                    .map((data) => {
                        data.heading = data.title;
                        delete data.subheading;
                        return blurbModel(data.slug, data);
                    }));
            });
    }, [slug]);

    return allArticles;
}


export default function SearchResults({location, setPath}) {
    const allArticles = useAllArticles(location);
    const [currentPage, setCurrentPage] = useState(1);

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
