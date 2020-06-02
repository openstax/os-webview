import {pageWrapper} from '~/controllers/jsx-wrapper';
import React, {useEffect} from 'react';
import {fetchPageDataJsx} from '~/helpers/controller/cms-mixin';
import './about.css';

const slug = 'pages/about';
const view = {
    classes: ['about', 'page'],
    tag: 'main'
};

function translateCard(c) {
    const imgEntry = c.find((v) => v.type === 'image');
    const textEntry = c.find((v) => v.type === 'paragraph');

    return {
        image: imgEntry.value.image,
        text: textEntry.value,
        link: imgEntry.value.link
    };
}

function Page() {
    const [pageData, statusPage] = fetchPageDataJsx({slug});

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
        <React.Fragment>
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
                                <a
                                    className="card"
                                    href={card.link}
                                >
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
        </React.Fragment>
    );
}

export default pageWrapper(Page, view);
