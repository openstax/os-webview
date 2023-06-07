import React from 'react';
import ArticleSummary, {blurbModel} from '../article-summary/article-summary';
import useLatestBlogEntries from '~/models/blog-entries';
import useBlogContext from '../blog-context';
import './more-stories.scss';
import SectionHeader from '../section-header/section-header';

export function LatestBlurbs({page, pageSize, exceptSlug, openInNewWindow}) {
    const numberNeeded = page * pageSize + 1;
    const latestStories = useLatestBlogEntries(numberNeeded);
    const {setPath, topicStories} = useBlogContext();

    if (!latestStories) {
        return null;
    }

    const articles = (topicStories.length ? topicStories : latestStories)
        .map(blurbModel)
        .filter((article) => exceptSlug !== article.articleSlug)
        .slice(-pageSize);

    return (
        <div
            className="latest-blurbs cards"
            data-analytics-content-list="Latest Blog Posts"
        >
            {
                articles.map((article) =>
                    <div className="card" key={article.articleSlug}>
                        <ArticleSummary {...{...article, setPath, openInNewWindow, HeadTag: 'h3'}} />
                    </div>
                )
            }
        </div>
    );
}

export default function MoreStories({exceptSlug, subhead}) {
    return (
        <div className="more-stories">
            <SectionHeader head="Latest blog posts" subhead={subhead} />
            <LatestBlurbs page={1} pageSize={3} exceptSlug={exceptSlug} />
            <div className="button-row">
                <a
                    className="btn primary"
                    href="/blog/latest"
                    data-analytics-link="blog_latest"
                >View more of the latest</a>
            </div>
        </div>
    );
}
