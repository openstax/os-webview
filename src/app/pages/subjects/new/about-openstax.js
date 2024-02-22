import React from 'react';
import useSubjectsContext from './context';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useOptimizedImage from '~/helpers/use-optimized-image';
import './about-openstax.scss';

export default function AboutOpenStax({
    forceButtonUrl='',
    forceButtonText='',
    aboutOs
}) {
    const {
        heading, osText: paragraph, linkText: buttonText, linkHref: buttonUrl, image: {file: imgSrc}
    } = aboutOs;
    const url = forceButtonUrl || buttonUrl;
    const text = forceButtonText || buttonText;
    const optimizedImage = useOptimizedImage(imgSrc, 400);

    return (
        <section className="about-openstax" id="learn">
            <div className="content">
                <h2>{heading}</h2>
                <RawHTML html={paragraph} />
                <a className="btn primary" href={url}>{text}</a>
                <img src={optimizedImage} alt="" />
            </div>
        </section>
    );
}

export function AllSubjectsAboutOpenStax() {
    const {aboutOs} = useSubjectsContext();

    return (
        <AboutOpenStax aboutOs={aboutOs[0].value} />
    );
}
