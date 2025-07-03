import React from 'react';
import BodyUnit, {UnitType} from '~/components/body-units/body-units';
import Byline from '~/components/byline/byline';
import {formatDateForBlog as formatDate, assertNotNull} from '~/helpers/data';
import '~/pages/blog/article/article.scss';
import usePageData from '~/helpers/use-page-data';
import './article.scss';

function Hero({coverUrl}: {coverUrl: string}) {
    return (
        <div className="hero" style={{backgroundImage: `url(${coverUrl})`}}>
            <img
                className="strips"
                src="/dist/images/components/strips.svg"
                height="10"
                alt=""
                role="presentation"
            />
        </div>
    );
}

type ArticleData = {
    articleImage: string | null;
    subheading: string;
    title: string;
    author: string;
    date: string;
    body: UnitType[];
};

function Article({data}: {data: ArticleData}) {
    const {
        articleImage: coverUrl,
        subheading,
        title,
        author,
        date: rawDate,
        body: bodyData
    } = data;
    const date = assertNotNull(formatDate(rawDate));

    return (
        <div className="article">
            {coverUrl !== null && <Hero coverUrl={coverUrl} />}
            <article className="text-content">
                <h1>{title}</h1>
                {Boolean(subheading) && <h2>{subheading}</h2>}
                <Byline author={author} date={date} />
                <div className="body">
                    {bodyData.map((unit) => (
                        <BodyUnit unit={unit} key={unit.value as string} />
                    ))}
                </div>
            </article>
        </div>
    );
}

type PageData =
    | ArticleData
    | {
          error: {message: string};
      };

export default function ArticleLoader({slug}: {slug: string}) {
    const data = usePageData<PageData>(slug, true);

    if (!data) {
        return null;
    }
    if ('error' in data) {
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
