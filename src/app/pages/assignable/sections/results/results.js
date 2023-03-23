import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './results.scss';

export default function Results({
    data
}) {
    const cards = [
        {
            heading: data.instructorText,
            linkText: data.instructorButtonText,
            linkUrl: data.instructorLink
        },
        {
            heading: data.adminText,
            linkText: data.adminButtonText,
            linkUrl: data.adminLink
        }
    ];
    const html = data.html || 'this could be a block of HTML, like a link';

    return (
        <section className="results near-white">
            <div className="content-block">
                <div className="cards">
                    {
                        cards.map((card) =>
                            <div className="card" key={card}>
                                <h2>{card.heading}</h2>
                                <div><a href={card.linkUrl}>{card.linkText}</a></div>
                            </div>
                        )
                    }
                </div>
                <RawHTML html={html} />
            </div>
        </section>
    );
}
