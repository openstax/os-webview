import React from 'react';
import './disruption.scss';

export type DisruptionModel = {
    heading: string;
    description: string;
    graph: {
        image: {
            image: string;
            altText: string;
        };
    };
};

export default function Disruption({
    model: {
        heading,
        description,
        graph: {
            image: {image, altText: imageAlt}
        }
    }
}: {
    model: DisruptionModel;
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
            <img
                className="strips"
                src="/dist/images/components/strips.svg"
                height="10"
                alt=""
                role="presentation"
            />
        </section>
    );
}
