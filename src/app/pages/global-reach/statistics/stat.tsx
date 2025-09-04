import React from 'react';
import './stat.scss';

export type CardData = {
    image: {
        image: string;
        altText: string;
    };
    number: string;
    unit: string;
    description: string;
}

function Card({item}: {item: CardData}) {
    return (
        <div className="col1">
            <div className="col-img-div">
                <img className="col-img" src={item.image.image} alt={item.image.altText} />
            </div>
            <div className="col-txt">
                <div className="upper-txt">
                    <div className="u-txt1">{item.number}</div>
                    <div className="u-txt2">{item.unit}</div>
                </div>
                <div className="lower-txt">{item.description}</div>
            </div>
        </div>
    );
}

export default function Statistics({cards}: {cards: CardData[]}) {
    return (
        <div className="stat-bg">
            <div className="statbox">
                {cards.map((card) => <Card item={card} key={card.description} />)}
            </div>
        </div>
    );
}
