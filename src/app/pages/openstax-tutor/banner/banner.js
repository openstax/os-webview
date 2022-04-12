import React from 'react';
import ButtonRow from '../button-row/button-row';
import ClippedImage from '~/components/clipped-image/clipped-image';
import './banner.scss';

export default function Banner({model}) {
    const tutorLogo = '/dist/images/openstax-tutor/tutor-logo.svg';
    const {header, description} = model;
    const [
        src, altText
    ] = [
        '/dist/images/openstax-tutor/student@3x.webp',
        'student at a desk'
    ];

    return (
        <section id="banner">
            <div className="left-side">
                <img className="ost-logo" src={tutorLogo} alt="OpenStax Tutor" />
                <div>
                    <h1>{header}</h1>
                    <div>{description}</div>
                </div>
                <ButtonRow model={model} />
            </div>
            <ClippedImage
                className="right-side" src={src} alt={altText}
                backgroundPosition="40% 30%"
            />
        </section>
    );
}
