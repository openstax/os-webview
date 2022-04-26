import React from 'react';
import ArticleSummary, {blurbModel} from '../article-summary/article-summary';
import useLatestBlogEntries from '~/models/blog-entries';
import useBlogContext from '../blog-context';
import './more-stories.scss';

export function LatestBlurbs({page, pageSize, exceptSlug, openInNewWindow}) {
    const numberNeeded = page * pageSize + 1;
    const latestStories = useLatestBlogEntries(numberNeeded);
    const {setPath} = useBlogContext();

    if (!latestStories) {
        return null;
    }

    const articles = latestStories
        .map(blurbModel)
        .filter((article) => exceptSlug !== article.articleSlug)
        .slice(-pageSize);

    return (
        <div className="latest-blurbs cards">
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

export default function MoreStories({exceptSlug}) {
    return (
        <div className="more-stories">
            <h2>Latest blog posts</h2>
            <LatestBlurbs page={1} pageSize={3} exceptSlug={exceptSlug} />
            <div className="button-row">
                <a className="btn primary" href="/blog/latest">View more of the latest</a>
            </div>
        </div>
    );
}
