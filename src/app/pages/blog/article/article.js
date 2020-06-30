import BodyUnit from '~/components/body-units/body-units.jsx';
import css from './article.css';
import {BylineJsx} from '~/components/byline/byline';
import ProgressRing from '~/components/progress-ring/progress-ring';
import throttle from '~/helpers/throttle';
import {ShareJsx} from '~/components/share/share';
import React, {useState, useEffect, useRef} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {usePageData} from '~/helpers/controller/cms-mixin';
import routerBus from '~/helpers/router-bus';

const view = {
    classes: ['article']
};

function getProgress(el) {
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

function ArticleBody({bodyData, setReadTime, setBodyRef}) {
    const bodyRef = useRef();

    useEffect(() => {
        const div = bodyRef.current;
        const words = div.textContent.split(/\W+/);
        const WORDS_PER_MINUTE = 225;

        setReadTime(Math.round(words.length / WORDS_PER_MINUTE));
    }, [bodyData]);
    useEffect(() => setBodyRef(bodyRef), []);

    return (
        <div className="body" ref={bodyRef}>
            {
                bodyData.map((unit) =>
                    <BodyUnit unit={unit} />
                )
            }
        </div>
    );
}

function Tags({tagData}) {
    return tagData.length > 0 &&
        <div className="tags">
            {
                tagData.map((tag) =>
                    <div className="tag">{tag}</div>
                )
            }
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
    const [bodyRef, setBodyRef] = useState();

    useEffect(() => {
        if (typeof bodyRef === 'undefined') {
            return null;
        }
        const handleScroll = throttle(() => setProgress(getProgress(bodyRef.current)));

        Array.from(ref.current.querySelectorAll('img'))
            .forEach((img) => {
                img.onload = handleScroll;
            });
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [bodyRef]);

    return [progress, setBodyRef];
}

function Article({data}) {
    const [readTime, setReadTime] = useState();
    const ref = useRef();
    const [progress, setBodyRef] = useScrollProgress(ref);
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
            <img src={image} alt={imageAlt} />
            <h1>{title}</h1>
            {
                Boolean(subheading) &&
                    <h2>{subheading}</h2>
            }
            <BylineJsx date={data.date} author={data.author} />
            <ArticleBody
                bodyData={data.body}
                setReadTime={setReadTime}
                setBodyRef={setBodyRef}
            />
            <Tags tagData={tags} />
        </div>
    );
}

function ArticleLoader({slug}) {
    const [data, statusPage] = usePageData({slug, preserveWrapping: true});

    if (data && data.error) {
        routerBus.emit('navigate', '/404', {path: '/blog'}, true);
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

export default pageWrapper(ArticleLoader, view);
