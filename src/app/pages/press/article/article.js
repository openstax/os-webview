import React from 'react';
import BodyUnit from '~/components/body-units/body-units';
import Byline from '~/components/byline/byline';
import {formatDateForBlog as formatDate} from '~/helpers/data';
import '~/pages/blog/article/article.scss';
import usePageData from '~/helpers/use-page-data';
import './article.scss';

function Hero({coverUrl}) {
    return (
        <div className='hero' style={`background-image: url(${coverUrl})`}>
            <img
                className='strips'
                src='/dist/images/components/strips.svg'
                height='10'
                alt=''
                role='presentation'
            />
        </div>
    );
}

function Article({data}) {
    const {
        articleImage: coverUrl,
        subheading,
        title,
        author,
        date: rawDate,
        body: bodyData
    } = data;
    const date = formatDate(rawDate);

    return (
        <div className='article'>
            {Boolean(coverUrl) && <Hero coverUrl={coverUrl} />}
            <article className='text-content'>
                <h1>{title}</h1>
                {Boolean(subheading) && <h2>{subheading}</h2>}
                <Byline author={author} date={date} />
                <div className='body'>
                    {bodyData.map((unit) => (
                        <BodyUnit unit={unit} key={unit.value} />
                    ))}
                </div>
            </article>
        </div>
    );
}

export function ArticleLoader({slug}) {
    const data = usePageData(slug, true);

    if (!data) {
        return null;
    }
    if (data.error) {
        return (
            <div className='text-content'>
                <h1>[Article not found]</h1>
                <pre>
                    {data.error.message} {slug}
                </pre>
            </div>
        );
    }

    return <Article data={data} />;
}
