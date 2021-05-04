import React from 'react';
import SearchBar from '../search-bar/search-bar';
import ArticleSummary from '../article-summary/article-summary';
import './more-stories.scss';

export default function MoreStories({articles, setPath}) {
    return (
        <div className="more-stories">
            <SearchBar setPath={setPath} />
            <div className="cards boxed">
                {
                    articles.map((article) =>
                        <div className="card" key={article.articleSlug}>
                            <ArticleSummary {...{...article, setPath}} />
                        </div>
                    )
                }
            </div>
        </div>
    );
}
