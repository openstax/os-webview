import React from 'react';
import useSubjectsContext from './context';
import './about-openstax.scss';

export default function AboutOpenStax({forceButtonUrl, forceButtonText}) {
    const {aboutOs} = useSubjectsContext();
    const {value: {
        heading, osText: paragraph, linkText: buttonText, linkHref: buttonUrl, image: {file: imgSrc}
    }} = aboutOs[0];
    const url = forceButtonUrl || buttonUrl;
    const text = forceButtonText || buttonText;

    return (
        <section className="about-openstax" id="learn">
            <div className="content">
                <h2>{heading}</h2>
                <div>{paragraph}</div>
                <a className="btn primary" href={url}>{text}</a>
                <img src={imgSrc} />
            </div>
        </section>
    );
}
