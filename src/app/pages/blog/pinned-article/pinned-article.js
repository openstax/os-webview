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
        <div className="pinned-article boxed">
            <ArticleSummary {...model} />
        </div>
    );
}
