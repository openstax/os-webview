import React from 'react';
import {usePageData} from '~/helpers/controller/cms-mixin';
import './about.css';

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

export default function About() {
    const [pageData, statusPage] = usePageData({slug});

    if (statusPage) {
        return statusPage;
    }

    const whoHeadline = pageData.who_heading;
    const whoBlurb = pageData.who_paragraph;
    const whoImage = pageData.who_image_url;
    const whatHeadline = pageData.what_heading;
    const whatBlurb = pageData.what_paragraph;
    const cards = (pageData.what_cards || []).map(translateCard);
    const whereHeadline = pageData.where_heading;
    const whereBlurb = pageData.where_paragraph;
    const map = pageData.where_map_url;
    const mapAlt = pageData.where_map_alt || 'animated map suggesting where our books are being adopted';

    return (
        <main className="about page">
            <section className="who">
                <div className="content">
                    <div className="text-block">
                        <h1>{whoHeadline}</h1>
                        <div dangerouslySetInnerHTML={{__html: whoBlurb}} />
                    </div>
                </div>
                <img src={whoImage} role="presentation" />
            </section>
            <section className="what">
                <div className="content">
                    <h1>{whatHeadline}</h1>
                    <div dangerouslySetInnerHTML={{__html: whatBlurb}} />
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
            <section className="where content">
                <div className="text-content">
                    <h1>{whereHeadline}</h1>
                    <div dangerouslySetInnerHTML={{__html: whereBlurb}} />
                </div>
            </section>
            <div className="map">
                <div className="content">
                    <img src={map} alt={mapAlt} />
                </div>
            </div>
        </main>
    );
}
