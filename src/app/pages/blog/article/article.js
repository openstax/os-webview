import BodyUnit from '~/components/body-units/body-units';
import Byline from '~/components/byline/byline';
import ProgressRing from '~/components/progress-ring/progress-ring';
import useScrollProgress from './use-progress';
import {ShareJsx} from '~/components/share/share';
import React, {useState, useRef} from 'react';
import usePageData from '~/helpers/use-page-data';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './article.scss';

function normalUnits(unit) {return unit.value.alignment !== 'bottom';}
function bottomUnits(unit) {return unit.value.alignment === 'bottom';}

function ArticleBody({bodyData, setReadTime, bodyRef}) {
    React.useEffect(() => {
        const div = bodyRef.current;
        const words = div.textContent.split(/\W+/);
        const WORDS_PER_MINUTE = 225;

        setReadTime(Math.round(words.length / WORDS_PER_MINUTE));
    }, [bodyRef, setReadTime]);

    return (
        <div className="body" ref={bodyRef}>
            {
                bodyData.filter(normalUnits)
                    .map((unit) => <BodyUnit unit={unit} key={unit} />)
            }
            {
                bodyData.filter(bottomUnits)
                    .map((unit) => <BodyUnit unit={unit} key={unit} />)
            }
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
        articleImage: image,
        featuredImageAltText: imageAlt,
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
    const {featuredVideo: [{value: videoEmbed}], body, tags} = data;

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
            } else if (data.featuredVideo?.length) {
                return VideoArticle;
            }
            return NormalArticle;
        },
        [data]
    );

    return (<ArticleContent data={data} />);
}

function ArticleLoader({slug, onLoad}) {
    const data = usePageData(slug, true);

    React.useEffect(
        () => {
            if (onLoad && data) {
                onLoad(data);
            }
        },
        [data, onLoad]
    );

    if (!data) {
        return null;
    }

    if (data.error) {
        return (
            <div className="text-content">
                <h1>[Article not found]</h1>
                <pre>{data.error.message} {slug}</pre>
            </div>
        );
    }

    return (<Article data={data} />);
}

export function ArticleFromSlug({slug, onLoad}) {
    return (
        <div className="article">
            <ArticleLoader slug={slug} onLoad={onLoad} />
        </div>
    );
}
