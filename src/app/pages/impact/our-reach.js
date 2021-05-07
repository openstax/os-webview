import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Hero from '~/components/hero/hero';
import LinkWithChevron from '~/components/link-with-chevron/link-with-chevron';
import './our-reach.scss';

function Card({data}) {
    const {description, icon, linkText, linkHref} = data;

    return (
        <div className="card">
            {icon && <img src={icon.file} alt="" height="30" width="30" />}
            <RawHTML html={description} />
            {linkText && <LinkWithChevron href={linkHref}>{linkText}</LinkWithChevron>}
        </div>
    );
}

export default function OurReach({
    model: {
        heading, description, cards,
        image: {image: imageSrc, altText: imageAlt}
    }
}) {
    return (
        <section className="our-reach off-white">
            <img className="strips" src="/images/components/strips.svg" height="10" alt="" role="presentation" />
            <Hero src={imageSrc} alt={imageAlt} reverse>
                <h2>{heading}</h2>
                <RawHTML html={description} />
                <div className="cards">
                    {cards.map((card) => <Card data={card} key={card.description} />)}
                </div>
            </Hero>
        </section>
    );
}
