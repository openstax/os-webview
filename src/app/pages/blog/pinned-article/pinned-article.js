import React from 'react';
import ArticleSummary, {blurbModel} from '../article-summary/article-summary';
import useBlogContext from '../blog-context';
import './pinned-article.scss';

export default function PinnedArticle() {
    const {pinnedStory, setPath} = useBlogContext();

    if (!pinnedStory) {
        return null;
    }
    const model = {...blurbModel(pinnedStory), setPath};

    return (
        <React.Fragment>
            <h2>Featured blog post</h2>
            <div className="pinned-article">
                <ArticleSummary {...model} HeadTag='h3' />
            </div>
        </React.Fragment>
    );
}
