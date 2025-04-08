import BodyUnit, {UnitType} from '~/components/body-units/body-units';
import Byline from '~/components/byline/byline';
import ProgressRing from '~/components/progress-ring/progress-ring';
import useScrollProgress from './use-progress';
import {ShareJsx} from '~/components/share/share';
import React, {useState, useRef} from 'react';
import usePageData from '~/helpers/use-page-data';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {
    setPageTitleAndDescriptionFromBookData,
    BookData
} from '~/helpers/use-document-head';
import './article.scss';

type ArticleArgs = {
    slug: string;
    onLoad: (data: ArticleData) => void;
};

export function ArticleFromSlug({slug, onLoad}: ArticleArgs) {
    return (
        <div className="article">
            <ArticleLoader slug={slug} onLoad={onLoad} />
        </div>
    );
}

export type ArticleData = BookData & {
    error?: {
        message: string;
    };
    heading: string;
    subheading: string;
    date: string;
    author: string;
    body: UnitType[];
    featuredVideo: [{value: string}];
    articleImage: string;
    featuredImageAltText: string;
    tags: string[];
    gatedContent?: boolean;
};

function ArticleLoader({slug, onLoad}: ArticleArgs) {
    const data = usePageData<ArticleData>(slug, true);

    React.useEffect(() => setPageTitleAndDescriptionFromBookData(data), [data]);

    React.useEffect(() => {
        if (onLoad && data) {
            onLoad(data);
        }
    }, [data, onLoad]);

    if (!data) {
        return null;
    }

    if (data.error) {
        return (
            <div className="text-content">
                <h1>[Article not found]</h1>
                <pre>
                    {data.error.message} {slug}
                </pre>
            </div>
        );
    }

    return <Article data={data} />;
}

export function Article({data}: {data: ArticleData}) {
    const ArticleContent = React.useMemo(() => {
        const isPdf = data.body.some((block) => block.type === 'document');

        if (isPdf) {
            return PdfArticle;
        } else if (data.featuredVideo?.length) {
            return VideoArticle;
        }
        return NormalArticle;
    }, [data]);

    return <ArticleContent data={data} />;
}

function NormalArticle({data}: {data: ArticleData}) {
    const [readTime, setReadTime] = useState<number>();
    const ref = useRef<HTMLDivElement>(null);
    const [progress, bodyRef] = useScrollProgress(ref);
    const {articleImage: image, featuredImageAltText: imageAlt, tags} = data;

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

function PdfArticle({data}: {data: ArticleData}) {
    return (
        <div className="content">
            <div className="pdf-title-block">
                <ShareButtons />
                <TitleBlock data={data} />
            </div>
            <div className="body">
                {data.body.map((unit) => (
                    <BodyUnit unit={unit} key={unit.id} />
                ))}
            </div>
        </div>
    );
}

function VideoArticle({data}: {data: ArticleData}) {
    const [readTime, setReadTime] = useState<number>();
    const ref = useRef<HTMLDivElement>(null);
    const [progress, bodyRef] = useScrollProgress(ref);
    const {
        featuredVideo: [{value: videoEmbed}],
        body,
        tags
    } = data;

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

function normalUnits(unit: UnitType) {
    return !bottomUnits(unit);
}
function bottomUnits(unit: UnitType) {
    return (
        typeof unit.value === 'object' &&
        'alignment' in unit.value &&
        unit.value.alignment === 'bottom'
    );
}

function ArticleBody({
    bodyData,
    setReadTime,
    bodyRef
}: {
    bodyData: UnitType[];
    setReadTime: (rt: number) => void;
    bodyRef: React.MutableRefObject<HTMLDivElement | undefined>;
}) {
    React.useEffect(() => {
        const words = bodyRef.current?.textContent?.split(/\W+/) as string[];
        const WORDS_PER_MINUTE = 225;

        setReadTime(Math.round(words.length / WORDS_PER_MINUTE));
    }, [bodyRef, setReadTime]);

    return (
        <div
            className="body"
            ref={bodyRef as React.MutableRefObject<HTMLDivElement>}
        >
            {bodyData.filter(normalUnits).map((unit) => (
                <BodyUnit unit={unit} key={unit.id} />
            ))}
            {bodyData.filter(bottomUnits).map((unit) => (
                <BodyUnit unit={unit} key={unit.id} />
            ))}
        </div>
    );
}

function Tags({tagData}: {tagData: ArticleData['tags']}) {
    return (
        tagData.length > 0 && (
            <div className="tags">
                {tagData.map((tag) => (
                    <div className="tag" key={tag}>
                        {tag}
                    </div>
                ))}
            </div>
        )
    );
}

function ShareButtons() {
    return (
        <ShareJsx
            pageUrl={encodeURIComponent(window.location.href)}
            message={encodeURIComponent(
                'Check out this OpenStax blog article!'
            )}
            minimal={true}
        />
    );
}

function FloatingSideBar({
    readTime,
    progress
}: {
    readTime?: number;
    progress: number;
}) {
    return (
        <div className="floater">
            <div className="sticky-bit">
                <ProgressRing
                    radius={45}
                    progress={progress}
                    stroke={4}
                    message={readTime}
                />
                <ShareButtons />
            </div>
        </div>
    );
}

function TitleBlock({data}: {data: ArticleData}) {
    const {heading: title, subheading, date, author} = data;

    return (
        <div className="title-block">
            <h1>{title}</h1>
            <div>
                {Boolean(subheading) && <h2>{subheading}</h2>}
                <Byline date={date} author={author} />
            </div>
        </div>
    );
}
