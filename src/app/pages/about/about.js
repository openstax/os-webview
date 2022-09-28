import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import LazyLoad from 'react-lazyload';
import './about.scss';

const slug = 'pages/about';

function translateCard(c) {
    const imgEntry = c.find((v) => v.type === 'image');
    const textEntry = c.find((v) => v.type === 'paragraph');

    return {
        image: imgEntry.value.image,
        text: textEntry.value,
        link: imgEntry.value.link
    };
}

function About({data: {
    whoHeading, whoParagraph, whoImageUrl,
    whatHeading, whatParagraph, whatCards,
    whereHeading, whereParagraph, whereMapUrl: map, whereMapAlt
}}) {
    const cards = (whatCards || []).map(translateCard);
    const mapAlt = whereMapAlt || 'animated map suggesting where our books are being adopted';

    return (
        <main className="about page">
            <section className="who">
                <div className="content">
                    <div className="text-block">
                        <h1>{whoHeading}</h1>
                        <div dangerouslySetInnerHTML={{__html: whoParagraph}} />
                    </div>
                </div>
                <img src={whoImageUrl} role="presentation" />
            </section>
            <LazyLoad>
                <section className="what">
                    <div className="content">
                        <div className="text-content">
                            <h2>{whatHeading}</h2>
                            <div dangerouslySetInnerHTML={{__html: whatParagraph}} />
                        </div>
                        <div className="cards">
                            {
                                cards.map((card) =>
                                    <a className="card" href={card.link} key={card}>
                                        <img src={card.image} role="presentation" />
                                        <div className="content">
                                            {card.text}
                                        </div>
                                    </a>
                                )
                            }
                        </div>
                    </div>
                </section>
            </LazyLoad>
            <LazyLoad>
                <section className="where content">
                    <div className="text-content">
                        <h2>{whereHeading}</h2>
                        <div dangerouslySetInnerHTML={{__html: whereParagraph}} />
                    </div>
                </section>
                <div className="map">
                    <div className="content">
                        <img src={map} alt={mapAlt} />
                    </div>
                </div>
            </LazyLoad>
        </main>
    );
}

export default function AboutLoader() {
    return (
        <LoaderPage slug={slug} Child={About} doDocumentSetup />
    );
}
