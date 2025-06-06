import React from 'react';
import Hero from '~/components/hero/hero';
import RawHTML from '~/components/jsx-helpers/raw-html';
import LinkWithChevron from '~/components/link-with-chevron/link-with-chevron';
import './four-square.scss';

export type Model = {
    heading: string;
    image: {
        image: string;
        altText: string;
    };
    description: string;
} & (
    | {
          buttonHref?: string;
          buttonText?: string;
      }
    | {
          cards: CardData[];
      }
);

type CardData = {
    description: string;
    icon: {file: string};
    linkText: string;
    linkHref: string;
};

export default function FourSquare({top, bottom}: {top: Model; bottom: Model}) {
    return (
        <React.Fragment>
            <HeroVariant top model={top} />
            <section className="our-reach off-white">
                <img
                    className="strips"
                    src="/dist/images/components/strips.svg"
                    height="10"
                    alt=""
                    role="presentation"
                />
                <HeroVariant model={bottom} />
            </section>
        </React.Fragment>
    );
}

function HeroVariant({top, model}: {top?: boolean; model: Model}) {
    const {heading, image, description} = model;
    const Tag = top ? 'h1' : 'h2';

    return (
        <Hero src={image.image} alt={image.altText} reverse={!top}>
            <Tag>{heading}</Tag>
            <RawHTML html={description} />
            {'cards' in model ? (
                <div className="cards">
                    {model.cards.map((card) => (
                        <Card data={card} key={card.description} />
                    ))}
                </div>
            ) : (
                <a className="btn primary" href={model.buttonHref}>
                    {model.buttonText}
                </a>
            )}
        </Hero>
    );
}

function Card({data}: {data: CardData}) {
    const {description, icon, linkText, linkHref} = data;

    return (
        <div className="card">
            {icon && <img src={icon.file} alt="" height="30" width="30" />}
            <RawHTML html={description} />
            {linkText && (
                <LinkWithChevron href={linkHref}>{linkText}</LinkWithChevron>
            )}
        </div>
    );
}
