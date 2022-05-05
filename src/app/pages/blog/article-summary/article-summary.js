import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Byline from '~/components/byline/byline';

export function blurbModel(data) {
    if (!data) {
        return {};
    }

    return {
        headline: data.heading,
        subheading: data.subheading,
        image: data.articleImage,
        altText: data.articleImageAlt,
        body: data.bodyBlurb,
        author: data.author,
        date: data.date,
        articleSlug: data.slug || data.meta.slug
    };
}

export default function ArticleSummary({
    articleSlug, altText, image, headline, subheading, body, date, author,
    forwardRef={}, setPath, openInNewWindow, HeadTag='h2'
}) {
    const tabTarget = openInNewWindow ? '_blank' : null;
    const SubTag = HeadTag.replace(/\d/, (n) => +n + 1);

    function onClick(event) {
        if (event.target.getAttribute('target') === '_blank') {
            return;
        }
        event.preventDefault();
        setPath(event.target.href);
    }

    return (
        <React.Fragment>
            <a
                className="link-image" href={`/blog/${articleSlug}`}
                ref={forwardRef}
                aria-label={altText || headline}
                style={`background-image: url("${image}")`}
                target={tabTarget} rel="noreferrer"
            />
            <div className="text-block">
                <HeadTag className="article-headline">
                    <a href={`/blog/${articleSlug}`} onClick={onClick}>{headline}</a>
                </HeadTag>
                {
                    subheading &&
                        <SubTag className="article-subhead">{subheading}</SubTag>
                }
                <Byline date={date} author={author} />
                <RawHTML className="article-blurb" html={body} />
                <a
                    className="read-more" href={`/blog/${articleSlug}`} onClick={onClick}
                    target={tabTarget}
                >
                    Read more
                </a>
            </div>
        </React.Fragment>
    );
}
