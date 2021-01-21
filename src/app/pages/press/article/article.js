import React from 'react';
import BodyUnit from '~/components/body-units/body-units.jsx';
import {Byline} from '~/components/byline/byline';
import {formatDateForBlog as formatDate} from '~/helpers/data';
import '~/pages/blog/article/article.css';
import {usePageData} from '~/helpers/controller/cms-mixin';

function Hero({coverUrl}) {
    return (
        <div className="hero" style={`background-image: url(${coverUrl})`}>
            <img
                className="strips" src="/images/components/strips.svg"
                height="10" alt="" role="presentation" />
        </div>
    );
}

function Article({data}) {
    const {
        article_image: coverUrl,
        subheading,
        title,
        author,
        date: rawDate,
        body: bodyData
    } = data;
    const date = formatDate(rawDate);

    return (
        <div className="article text-content">
            {
                Boolean(coverUrl) && <Hero coverUrl={coverUrl} />
            }
            <article>
                <h1>{title}</h1>
                {
                    Boolean(subheading) && <h2>{subheading}</h2>
                }
                <Byline author={author} date={date} />
                <div className="body">
                    {
                        bodyData.map((unit) => <BodyUnit unit={unit} key={unit.value} />)
                    }
                </div>
            </article>
        </div>
    );
}

export function ArticleLoader({slug}) {
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
