import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './results.scss';

export default function Results({cards, html}) {
    return (
        <section className="results near-white">
            <div className="content-block">
                <div className="cards">
                    {
                        cards.map((card) =>
                            <div className="card" key={card}>
                                <h2>{card.heading}</h2>
                                <div><a href={card.infoLinkUrl}>{card.infoLinkText}</a></div>
                                <div><a href={card.helpLinkUrl}>{card.helpLinkText}</a></div>
                            </div>
                        )
                    }
                </div>
                <RawHTML html={html} />
            </div>
        </section>
    );
}
