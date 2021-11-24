import React from 'react';
import useSubjectsContext from './context';
import './about-openstax.scss';

export default function AboutOpenStax({forceButtonUrl, forceButtonText}) {
    const {aboutOpenstax: {
        heading, paragraph, buttonText, buttonUrl, imgSrc
    }} = useSubjectsContext();
    const url = forceButtonUrl || buttonUrl;
    const text = forceButtonText || buttonText;

    return (
        <section className="about-openstax">
            <div className="content">
                <h2>{heading}</h2>
                <div>{paragraph}</div>
                <a className="btn primary" href={url}>{text}</a>
                <img src={imgSrc} />
            </div>
        </section>
    );
}
