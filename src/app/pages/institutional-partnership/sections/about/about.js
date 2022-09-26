import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './about.scss';

export default function About({
    heading, description, altText,
    image: {meta: {downloadUrl: image}}
}) {
    return (
        <section className="about near-white">
            <div className="content-block">
                <div className="text-block">
                    <h2>{heading}</h2>
                    <RawHTML className="description-block" html={description} />
                </div>
                <img src={image} alt={altText} />
            </div>
        </section>
    );
}
