import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import Byline from '~/components/byline/byline';

export function blurbModel(data) {
    if (!data) {
        return {};
    }

    return {
        id: data.id,
        collectionNames: data.collections.map((item) => 'name' in item ?
            item.name :
            item.value.map(({collection}) => collection.name)
        ).flat(2),
        articleSubjectNames: data.articleSubjects.map((item) => 'name' in item ?
            item.name :
            item.value.map(({subject}) => subject.name)
        ).flat(2),
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
    id, articleSlug, altText, image, headline, subheading, body, date, author, collectionNames, articleSubjectNames,
    forwardRef={}, setPath, openInNewWindow, HeadTag='h2'
}) {
    const tabTarget = openInNewWindow ? '_blank' : null;
    const SubTag = HeadTag.replace(/\d/, (n) => +n + 1);
    const onClick = React.useCallback(
        (event) => {
            if (event.target.getAttribute('target') === '_blank') {
                return;
            }
            event.preventDefault();
            setPath(event.target.href);
        },
        [setPath]
    );

    const analytics = {
        'data-analytics-select-content': id,
        'data-content-type': 'blog_post',
        'data-content-name': headline,
        'data-content-categories': [...collectionNames, ...articleSubjectNames]
    };

    return (
        <React.Fragment>
            <a
                {...analytics}
                className="link-image" href={`/blog/${articleSlug}`}
                ref={forwardRef}
                aria-label={altText || headline}
                style={`background-image: url("${image}")`}
                target={tabTarget} rel="noreferrer"
            />
            <div className="text-block">
                <HeadTag className="article-headline">
                    <a {...analytics} href={`/blog/${articleSlug}`} onClick={onClick} target={tabTarget}>
                        {headline}
                    </a>
                </HeadTag>
                {
                    subheading &&
                        <SubTag className="article-subhead">{subheading}</SubTag>
                }
                <Byline date={date} author={author} />
                <RawHTML className="article-blurb" html={body} />
                <a
                    {...analytics}
                    className="read-more" href={`/blog/${articleSlug}`} onClick={onClick}
                    target={tabTarget}
                >
                    Read more
                </a>
            </div>
        </React.Fragment>
    );
}
