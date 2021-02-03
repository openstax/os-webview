import React, {useState, useRef, useEffect, useContext} from 'react';
import {RawHTML, WindowContext} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {Byline} from '~/components/byline/byline';
import $ from '~/helpers/$';
import debounce from 'lodash/debounce';

export function blurbModel(articleSlug, data) {
    if (!data) {
        return {};
    }
    return {
        headline: data.heading,
        subheading: data.subheading,
        image: data.article_image,
        altText: data.article_image_alt,
        body: data.body_blurb,
        author: data.author,
        date: data.date,
        articleSlug
    };
}

export function ArticleSummary({
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

export default function DelayedImagesSummary({image, ...otherProps}) {
    const [delayedImage, setDelayedImage] = useState('');
    const elRef = useRef();
    const windowCx = useContext(WindowContext);

    useEffect(() => {
        if (delayedImage !== image && elRef.current && $.overlapsViewport(elRef.current)) {
            setDelayedImage(image);
        }
    }, [delayedImage, image, windowCx]);

    return (
        <ArticleSummary image={delayedImage} {...otherProps} forwardRef={elRef} />
    );
}
