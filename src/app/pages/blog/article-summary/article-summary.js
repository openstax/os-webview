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
    forwardRef={}, setPath
}) {
    function onClick(event) {
        event.preventDefault();
        setPath(event.target.href);
    }

    return (
        <React.Fragment>
            <a
                className="link-image" href={`/blog/${articleSlug}`}
                ref={forwardRef}
                aria-label={altText}
                style={`background-image: url("${image}")`}></a>
            <div className="text-block">
                <h2 className="article-headline">
                    <a href={`/blog/${articleSlug}`} onClick={onClick}>{headline}</a>
                </h2>
                {
                    subheading &&
                        <h3>{subheading}</h3>
                }
                <RawHTML className="article-blurb" html={body} />
                <a className="go-to" href={`/blog/${articleSlug}`} onClick={onClick}>read more</a>
                <Byline date={date} author={author} />
            </div>
        </React.Fragment>
    );
}
