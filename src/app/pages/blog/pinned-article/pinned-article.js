import React from 'react';
import ArticleSummary, {blurbModel} from '../article-summary/article-summary';
import useBlogContext from '../blog-context';
import SectionHeader from '../section-header/section-header';
import './pinned-article.scss';

export default function PinnedArticle({subhead}) {
    const {pinnedStory, setPath} = useBlogContext();

    if (!pinnedStory) {
        return null;
    }
    const model = {...blurbModel(pinnedStory), setPath};

    return (
        <React.Fragment>
            <SectionHeader head="Featured blog post" subhead={subhead} />
            <div
                className="pinned-article"
                data-list-name="Featured Blog Posts"
                data-analytics-content-list="featured_blog_posts"
            >
                <ArticleSummary {...model} HeadTag='h3' />
            </div>
        </React.Fragment>
    );
}
