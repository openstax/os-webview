import React from 'react';
import useSubjectsContext from './context';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './tutor-ad.scss';

export function TutorAdThatTakesData({heading, image, html, ctaLink, ctaText}) {
    return (
        <section className="tutor-ad">
            <div className="content">
                <h2>{heading}</h2>
                <img role="presentation" src={image?.file} />
                <RawHTML html={html} />
                <a className="btn primary" href={ctaLink}>{ctaText}</a>
            </div>
        </section>
    );
}

export default function TutorAd() {
    const {tutorAd} = useSubjectsContext();
    const {image, heading, adHtml: html, linkHref: ctaLink, linkText: ctaText} = tutorAd[0].value;

    return (
        <TutorAdThatTakesData {...{heading, image, html, ctaLink, ctaText}} />
    );
}
