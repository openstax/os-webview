import React from 'react';
import ArticleSummary, {
    ArticleSummaryData,
    blurbModel
} from '../article-summary/article-summary';
import useBlogContext from '../blog-context';
import Section from '~/components/explore-page/section/section';
import './pinned-article.scss';

export default function PinnedArticle({subhead}: {subhead?: string}) {
    const {pinnedStory, setPath} = useBlogContext();

    if (!pinnedStory) {
        return null;
    }
    const model = {...blurbModel(pinnedStory), setPath} as ArticleSummaryData;

    return (
        <Section name="Featured blog post" topicHeading={subhead}>
            <div
                className="pinned-article"
                data-analytics-content-list="Featured Blog Posts"
            >
                <ArticleSummary {...model} HeadTag="h3" />
            </div>
        </Section>
    );
}
