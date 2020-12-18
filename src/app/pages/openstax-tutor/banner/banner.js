import React from 'react';
import linkHelper from '~/helpers/link';
import ButtonRow from '../button-row/button-row';
import ClippedImage from '~/components/clipped-image/clipped-image';
import './banner.css';

export default function Banner({model}) {
    const tutorLogo = '/images/openstax-tutor/tutor-logo.svg';
    const {header, description} = model;
    const tutorLoginText = 'Log in to OpenStax Tutor';
    const [
        src, altText
    ] = [
        '/images/openstax-tutor/student@3x.jpg',
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
