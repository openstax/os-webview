import React from 'react';
import useSubjectsContext from './context';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './tutor-ad.scss';

export default function TutorAd() {
    const {tutorAd: {image, heading, html, ctaLink, ctaText}} = useSubjectsContext();

    return (
        <section className="tutor-ad">
            <div className="content">
                <h1>{heading}</h1>
                <img role="presentation" src={image} />
                <RawHTML html={html} />
                <a className="btn primary" href={ctaLink}>{ctaText}</a>
            </div>
        </section>
    );
}
