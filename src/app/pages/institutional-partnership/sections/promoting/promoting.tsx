import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './promoting.scss';

type WideCard = {
    icon: {
        image: string;
        altText: string;
    };
    html: string;
};

type TallCard = {
    html: string;
    link: string;
    linkText: string;
};

export type PromotingProps = {
    heading: string;
    description: string;
    tallCards: [TallCard[]];
    wideCards: [WideCard[]];
};

export default function Promoting({
    heading,
    description,
    tallCards: [tallCards],
    wideCards: [wideCards]
}: PromotingProps) {
    return (
        <section className="promoting white">
            <div className="content-block">
                <div>
                    <h2>{heading}</h2>
                    <RawHTML className="description-block" html={description} />
                </div>
                <div className="cards">
                    <div className="wide card">
                        {wideCards.map((item) => (
                            <div className="wide-card-entry" key={item.html}>
                                <img
                                    src={item.icon.image}
                                    alt={item.icon.altText}
                                />
                                <RawHTML html={item.html} />
                            </div>
                        ))}
                    </div>
                    {tallCards.map((item, index) => (
                        <div className="card tall" key={index}>
                            <RawHTML html={item.html} />
                            <a
                                href={item.link}
                                className="btn primary"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {item.linkText}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
