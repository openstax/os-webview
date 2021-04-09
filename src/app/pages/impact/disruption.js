import React from 'react';
import './disruption.scss';

export default function Disruption({
    model: {
        heading, description, graph: {image: {image, altText: imageAlt}}
    }
}) {
    return (
        <section className="disruption-section off-white">
            <div className="boxed">
                <div className="text-content">
                    <h2>{heading}</h2>
                    <div>{description}</div>
                </div>
                <img src={image} alt={imageAlt} />
            </div>
            <img className="strips" src="/images/components/strips.svg" height="10" alt="" role="presentation" />
        </section>
    );
}
