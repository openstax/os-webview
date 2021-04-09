import React from 'react';
import SearchBar from '../search-bar/search-bar';
import DelayedImagesSummary from '../article-summary/article-summary.jsx';
import './more-stories.scss';

export default function MoreStories({articles, setPath}) {
    return (
        <div className="more-stories">
            <SearchBar setPath={setPath} />
            <div className="cards boxed">
                {
                    articles.map((article) =>
                        <div className="card" key={article.articleSlug}>
                            <DelayedImagesSummary {...{...article, setPath}} />
                        </div>
                    )
                }
            </div>
        </div>
    );
}
