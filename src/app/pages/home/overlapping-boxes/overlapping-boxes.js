import React from 'react';
import './overlapping-boxes.scss';

function CTABox({data: {header, description, link, buttonText}}) {
    return (
        <div className="cta-box">
            <div className="text-block">
                <h1>{header}</h1>
                <div className="description">{description}</div>
                <a className="btn primary" href={link}>{buttonText}</a>
            </div>
        </div>
    );
}

export default function OverlappingBoxes({data: {k12Cta, researchCta}}) {
    return (
        <section className="overlapping-boxes near-white">
            <div className="overlapping">
                <CTABox data={k12Cta} />
                <CTABox data={researchCta} />
            </div>
        </section>
    );
}
