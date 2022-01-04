import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './about.scss';

function onClick(event) {
    const lastSection = Array.from(document.querySelectorAll('section')).pop();

    lastSection.scrollIntoView({block: 'nearest', behavior: 'smooth'});
    event.currentTarget.blur();
    event.preventDefault();
}

function RegisterBox({register}) {
    return (
        <div className="location-box">
            <h2>{register.headline}</h2>
            <RawHTML html={register.address} />
            <a className="btn down-page" href={register.buttonUrl} onClick={onClick}>
                {register.buttonText}
            </a>
        </div>
    );
}

export default function About({
    data,
    register
}) {
    const {
        superheading,
        heading,
        paragraph: description,
        cards
    } = data;

    return (
        <section className="about">
            <div className="boxed">
                <RegisterBox register={register} />
                <div className="super-headline">{superheading}</div>
                <div className="text-block-left">
                    <div>
                        <h2>{heading}</h2>
                        <RawHTML html={description} />
                        <div className="blue-line"></div>
                    </div>
                    <div className="cards">
                        {
                            cards.map((card) =>
                                <div key={card.headline} className="card">
                                    <img src={card.icon.image} alt />
                                    <h3>{card.headline}</h3>
                                    <RawHTML html={card.description} />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </section>
    );
}
