import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './results.scss';

type Card = {
    headingNumber: string;
    headingUnit: string;
    description: string;
};

export type ResultsProps = {
    heading: string;
    description: string;
    cards: [Card[]];
};

export default function Results({
    heading,
    description,
    cards: [cards]
}: ResultsProps) {
    const images = [
        '/dist/images/institutional-partnership/first-result-icon.svg',
        '/dist/images/institutional-partnership/second-result-icon.svg'
    ];

    return (
        <section className="results near-white">
            <div className="content-block">
                <div className="text-block">
                    <h2>{heading}</h2>
                    <RawHTML className="description-block" html={description} />
                </div>
                <div className="cards">
                    {cards.map((card, i) => (
                        <div className="card" key={i}>
                            <img className="corner-icon" src={images[i]} />
                            <div className="heading">
                                <span className="big-text">
                                    {card.headingNumber}
                                </span>
                                {card.headingUnit}
                            </div>
                            <div className="description-block">
                                {card.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
