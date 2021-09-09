import BodyUnit from '~/components/body-units/body-units';
import Byline from '~/components/byline/byline';
import ProgressRing from '~/components/progress-ring/progress-ring';
import {ShareJsx} from '~/components/share/share';
import React, {useState, useEffect, useRef} from 'react';
import useWindowContext from '~/contexts/window';
import {usePageData} from '~/helpers/controller/cms-mixin';
import useRouterContext from '~/components/shell/router-context';
import './article.scss';

function getProgress(el) {
    if (!el) {
        return 0;
    }
    const divRect = el.getBoundingClientRect();
    const viewportBottom = window.innerHeight;
    const visibleHeight = viewportBottom - divRect.top;
    const totalHeight = divRect.height;

    if (visibleHeight <= 0) {
        return 0;
    }
    if (viewportBottom >= divRect.bottom) {
        return 100;
    }

    return Math.round(100 * visibleHeight / totalHeight);
}

function ArticleBody({bodyData, setReadTime, bodyRef}) {
    useEffect(() => {
        const div = bodyRef.current;
        const words = div.textContent.split(/\W+/);
        const WORDS_PER_MINUTE = 225;

        setReadTime(Math.round(words.length / WORDS_PER_MINUTE));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="body" ref={bodyRef}>
            {bodyData.map((unit) => <BodyUnit unit={unit} key={unit} />)}
        </div>
    );
}

function Tags({tagData=[]}) {
    return tagData.length > 0 &&
        <div className="tags">
            {tagData.map((tag) => <div className="tag" key={tag}>{tag}</div>)}
        </div>
    ;
}

function FloatingSideBar({readTime, progress}) {
    return (
        <div className="floater">
            <div className="sticky-bit">
                <ProgressRing radius="45" progress={progress} stroke="4" message={readTime} />
                <ShareJsx
                    pageUrl={encodeURIComponent(window.location.href)}
                    message={encodeURIComponent('Check out this OpenStax blog article!')}
                    minimal={true}
                />
            </div>
        </div>
    );
}

function useScrollProgress(ref) {
    const [progress, setProgress] = useState(0);
    const bodyRef = useRef();
    const windowCx = useWindowContext();

    useEffect(() => {
        if (typeof bodyRef === 'undefined') {
            return;
        }

        Array.from(ref.current.querySelectorAll('img'))
            .forEach((img) => {
                img.onload = () => setProgress(getProgress(bodyRef.current));
            });
    }, [ref, bodyRef]);

    useEffect(() => {
        if (typeof bodyRef === 'undefined') {
            return;
        }
        const handleScroll = () => setProgress(getProgress(bodyRef.current));

        handleScroll();
    }, [bodyRef, windowCx]);

    return [progress, bodyRef];
}

export function Article({data}) {
    const [readTime, setReadTime] = useState();
    const ref = useRef();
    const [progress, bodyRef] = useScrollProgress(ref);
    const {
        article_image: image,
        featured_image_alt_text: imageAlt,
        heading: title,
        subheading,
        tags
    } = data;

    return (
        <div className="text-content" ref={ref}>
            <FloatingSideBar readTime={readTime} progress={progress} />
            {image && <img src={image} alt={imageAlt} />}
            <h1>{title}</h1>
            {
                Boolean(subheading) &&
                    <h2>{subheading}</h2>
            }
            <Byline date={data.date} author={data.author} />
            <ArticleBody
                bodyData={data.body}
                setReadTime={setReadTime}
                bodyRef={bodyRef}
            />
            <Tags tagData={tags} />
        </div>
    );
}

function ArticleLoader({slug}) {
    const [data, statusPage] = usePageData({slug, preserveWrapping: true});
    const {fail} = useRouterContext();

    if (data && data.error) {
        fail(`Could not load ${slug}`);
        return null;
    }
    return (statusPage ? statusPage : <Article data={data} />);
}

export function ArticleFromSlug({slug}) {
    return (
        <div className="article">
            <ArticleLoader slug={slug} />
        </div>
    );
}
