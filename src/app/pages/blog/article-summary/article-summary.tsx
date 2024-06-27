import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import Byline from '~/components/byline/byline';
import ClippedImage from '~/components/clipped-image/clipped-image';

type Collection = {
    name?: string;
    value: {collection: Collection}[];
};

type ArticleSubject = {
    name?: string;
    value: {subject: ArticleSubject}[];
};

type BlurbData = null | {
    id: string;
    collections: Collection[];
    articleSubjects: ArticleSubject[];
    heading: string;
    subheading: string;
    articleImage: string;
    articleImageAlt: string;
    bodyBlurb: string;
    author: string;
    date: string;
    slug?: string;
    meta: {slug: string};
};

export function blurbModel(data: BlurbData) {
    if (!data) {
        return {};
    }

    return {
        id: data.id,
        collectionNames: data.collections
            .map((item) =>
                'name' in item
                    ? item.name
                    : item.value.map(({collection}) => collection.name)
            )
            .flat(2),
        articleSubjectNames: data.articleSubjects
            .map((item) =>
                'name' in item
                    ? item.name
                    : item.value.map(({subject}) => subject.name)
            )
            .flat(2),
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

export type ArticleSummaryData = {
    articleSlug: string;
    image: string;
    headline: string;
    subheading: string;
    body: string;
    date: string;
    author: string;
    collectionNames: string[];
    articleSubjectNames: string[];
    setPath: (href: string) => void;
    openInNewWindow: boolean;
    HeadTag?: keyof JSX.IntrinsicElements;
};

export default function ArticleSummary({
    articleSlug,
    image,
    headline,
    subheading,
    body,
    date,
    author,
    collectionNames,
    articleSubjectNames,
    setPath,
    openInNewWindow,
    HeadTag = 'h2'
}: ArticleSummaryData) {
    const tabTarget = openInNewWindow ? {target: '_blank'} : {};
    const SubTag = HeadTag.replace(/\d/, (n) =>
        (Number(n) + 1).toString()
    ) as keyof JSX.IntrinsicElements;
    const onClick = React.useCallback(
        (event: React.MouseEvent) => {
            const target = event.target as HTMLAnchorElement;

            if (target.getAttribute('target') === '_blank') {
                return;
            }
            event.preventDefault();
            setPath(target.href);
        },
        [setPath]
    );

    const analytics = {
        'data-analytics-select-content': headline,
        'data-content-type': 'Blog Post',
        'data-content-tags': [
            '',
            ...collectionNames.map((collection) => `collection=${collection}`),
            ...articleSubjectNames.map((subject) => `subject=${subject}`),
            ''
        ].join(',')
    };

    return (
        <React.Fragment>
            <ClippedImage src={image} />
            <div className="text-block">
                <HeadTag className="article-headline">
                    <a
                        {...analytics}
                        href={`/blog/${articleSlug}`}
                        onClick={onClick}
                        {...tabTarget}
                    >
                        {headline}
                    </a>
                </HeadTag>
                {subheading && (
                    <SubTag className="article-subhead">{subheading}</SubTag>
                )}
                <Byline date={date} author={author} />
                <RawHTML className="article-blurb" html={body} />
                <a
                    {...analytics}
                    className="read-more"
                    href={`/blog/${articleSlug}`}
                    onClick={onClick}
                    aria-label={`Read more about ${headline}`}
                    {...tabTarget}
                >
                    Read more
                </a>
            </div>
        </React.Fragment>
    );
}
