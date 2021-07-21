import React from 'react';
import SearchBar from '../search-bar/search-bar';
import ArticleSummary, {blurbModel} from '../article-summary/article-summary';
import useBlogContext from '../blog-context';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretLeft} from '@fortawesome/free-solid-svg-icons/faCaretLeft';
import {faCaretRight} from '@fortawesome/free-solid-svg-icons/faCaretRight';
import $ from '~/helpers/$';
import './more-stories.scss';

function LimitController() {
    const {limit, pageSize, moreStories, fewerStories} = useBlogContext();

    return (
        <div className="button-row">
            {
                limit > pageSize ?
                    <button type="button" onClick={fewerStories} onKeyDown={$.treatSpaceOrEnterAsClick}>
                        <FontAwesomeIcon icon={faCaretLeft} />
                        {' '}Newer stories
                    </button> :
                    <div />
            }
            <button type="button" onClick={moreStories} onKeyDown={$.treatSpaceOrEnterAsClick}>
                Older stories{' '}
                <FontAwesomeIcon icon={faCaretRight} />
            </button>
        </div>
    );
}

export default function MoreStories({exceptSlug}) {
    const {
        pinnedStory, latestStories, setPath, pageSize
    } = useBlogContext();

    if (!latestStories) {
        return null;
    }

    const articles = [pinnedStory, ...latestStories]
        .map(blurbModel)
        .filter((article) => exceptSlug !== article.articleSlug)
        .slice(-pageSize);

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
            <LimitController />
        </div>
    );
}
