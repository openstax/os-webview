import BodyUnit from '~/components/body-units/body-units';
import Byline from '~/components/byline/byline';
import ProgressRing from '~/components/progress-ring/progress-ring';
import {ShareJsx} from '~/components/share/share';
import React, {useState, useEffect, useRef} from 'react';
import useWindowContext from '~/contexts/window';
import {usePageData} from '~/helpers/controller/cms-mixin';
import useRouterContext from '~/components/shell/router-context';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
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
    }, [bodyRef, setReadTime]);

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

function ShareButtons() {
    return (
        <ShareJsx
            pageUrl={encodeURIComponent(window.location.href)}
            message={encodeURIComponent('Check out this OpenStax blog article!')}
            minimal={true}
        />
    );
}

function FloatingSideBar({readTime, progress}) {
    return (
        <div className="floater">
            <div className="sticky-bit">
                <ProgressRing radius="45" progress={progress} stroke="4" message={readTime} />
                <ShareButtons />
            </div>
        </div>
    );
}

function useScrollProgress(ref) {
    const bodyRef = useRef();
    const [progress, updateProgress] = React.useReducer(
        (state) => bodyRef ? getProgress(bodyRef.current) : state,
        0
    );
    const windowCx = useWindowContext();

    useEffect(
        () => {
            Array.from(ref.current.querySelectorAll('img'))
                .forEach((img) => {
                    img.onload = updateProgress;
                });
        },
        [ref]
    );

    useEffect(updateProgress, [windowCx, updateProgress]);

    return [progress, bodyRef];
}

function TitleBlock({data}) {
    const {
        heading: title,
        subheading,
        date,
        author
    } = data;

    return (
        <div className="title-block">
            <h1>{title}</h1>
            <div>
                {
                    Boolean(subheading) &&
                    <h2>{subheading}</h2>
                }
                <Byline date={date} author={author} />
            </div>
        </div>
    );
}

function NormalArticle({data}) {
    const [readTime, setReadTime] = useState();
    const ref = useRef();
    const [progress, bodyRef] = useScrollProgress(ref);
    const {
        article_image: image,
        featured_image_alt_text: imageAlt,
        tags
    } = data;

    return (
        <div className="content">
            <FloatingSideBar readTime={readTime} progress={progress} />
            <div className="image-and-title">
                <div className="floater-spacer" />
                {image && <img src={image} alt={imageAlt} />}
                <TitleBlock data={data} />
            </div>
            <div className="text-content" ref={ref}>
                <ArticleBody
                    bodyData={data.body}
                    setReadTime={setReadTime}
                    bodyRef={bodyRef}
                />
                <Tags tagData={tags} />
            </div>
        </div>
    );
}

function PdfArticle({data}) {
    return (
        <div className="content">
            <div className="pdf-title-block">
                <ShareButtons />
                <TitleBlock data={data} />
            </div>
            <div className="body">
                {data.body.map((unit) => <BodyUnit unit={unit} key={unit} />)}
            </div>
        </div>
    );
}

function VideoArticle({data}) {
    const [readTime, setReadTime] = useState();
    const ref = useRef();
    const [progress, bodyRef] = useScrollProgress(ref);
    const {featured_video: [{value: videoEmbed}], body, tags} = data;

    return (
        <div className="content">
            <FloatingSideBar readTime={readTime} progress={progress} />
            <div className="title-and-video">
                <div className="floater-spacer" />
                <TitleBlock data={data} />
                <RawHTML embed html={videoEmbed} className="video-block" />
            </div>
            <div className="text-content" ref={ref}>
                <ArticleBody
                    bodyData={body}
                    setReadTime={setReadTime}
                    bodyRef={bodyRef}
                />
                <Tags tagData={tags} />
            </div>
        </div>
    );
}

export function Article({data}) {
    const ArticleContent = React.useMemo(
        () => {
            const isPdf = data.body.some((block) => block.type === 'document');

            if (isPdf) {
                return PdfArticle;
            } else if (data.featured_video?.length) {
                console.info('Using Video article');
                return VideoArticle;
            }
            return NormalArticle;
        },
        [data]
    );

    return (<ArticleContent data={data} />);
}

function ArticleLoader({slug, onLoad}) {
    const [data, statusPage] = usePageData({slug, preserveWrapping: true});
    const {fail} = useRouterContext();

    React.useEffect(
        () => {
            if (data && data.error) {
                fail(`Could not load ${slug}`);
            }
            if (onLoad && data) {
                onLoad(data);
            }
        },
        [data, onLoad, fail, slug]
    );

    return (statusPage ? statusPage : <Article data={data} />);
}

export function ArticleFromSlug({slug, onLoad}) {
    return (
        <div className="article">
            <ArticleLoader slug={slug} onLoad={onLoad} />
        </div>
    );
}
