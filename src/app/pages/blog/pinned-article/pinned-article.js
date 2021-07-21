import React from 'react';
import ArticleSummary, {blurbModel} from '../article-summary/article-summary';
import BlogContext from '../blog-context';
import './pinned-article.scss';

export default function PinnedArticle() {
    const {pinnedStory, setPath} = React.useContext(BlogContext);

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
