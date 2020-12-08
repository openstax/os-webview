import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './promoting.css';

export default function Promoting({
    heading, description,
    tallCards: [tallCards],
    wideCards: [wideCards]
}) {
    return (
        <section className="promoting white">
            <div className="content-block">
                <div>
                    <h2>{heading}</h2>
                    <RawHTML className="description-block" html={description} />
                </div>
                <div className="cards">
                    <div className="wide card">
                        {
                            wideCards.map((item) =>
                                <div className="wide-card-entry" key={item}>
                                    <img src={item.icon.image} alt={item.icon.altText} />
                                    <RawHTML html={item.html} />
                                </div>
                            )
                        }
                    </div>
                    {
                        tallCards.map((item) =>
                            <div className="card tall" key={item}>
                                <RawHTML html={item.html} />
                                <a
                                    href={item.link} className="btn primary"
                                    _target="blank"
                                >
                                    {item.linkText}
                                </a>
                            </div>
                        )
                    }
                </div>
            </div>
        </section>
    );
}
