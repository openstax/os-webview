import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './results.css';

export default function Results({heading, description, cards: [cards], ...other}) {
    const images = [
        '/images/institutional-partnership/first-result-icon.svg',
        '/images/institutional-partnership/second-result-icon.svg'
    ];

    return (
        <section className="results near-white">
            <div className="content-block">
                <div className="text-block">
                    <h2>{heading}</h2>
                    <RawHTML className="description-block" html={description} />
                </div>
                <div className="cards">
                    {
                        cards.map((card, i) =>
                            <div className="card" key={card}>
                                <img className="corner-icon" src={images[i]} />
                                <div className="heading">
                                    <span className="big-text">{card.headingNumber}</span>
                                    {card.headingUnit}
                                </div>
                                <div className="description-block">{card.description}</div>
                            </div>
                        )
                    }
                </div>
            </div>
        </section>
    );
}
