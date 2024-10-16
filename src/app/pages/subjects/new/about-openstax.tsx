import React from 'react';
import useSubjectsContext, {ImageData} from './context';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useOptimizedImage from '~/helpers/use-optimized-image';
import './about-openstax.scss';

export type AboutOsData = {
    heading: string;
    osText: string;
    linkText: string;
    linkHref: string;
    image: ImageData;
};

export default function AboutOpenStax({
    forceButtonUrl = '',
    forceButtonText = '',
    aboutOs
}: {
    forceButtonUrl?: string;
    forceButtonText?: string;
    aboutOs: AboutOsData;
}) {
    const {
        heading,
        osText: paragraph,
        linkText: buttonText,
        linkHref: buttonUrl,
        image: {file: imgSrc}
    } = aboutOs;
    const url = forceButtonUrl || buttonUrl;
    const text = forceButtonText || buttonText;
    const optimizedImage = useOptimizedImage(imgSrc, 400);

    return (
        <section className="about-openstax">
            <div className="content">
                <h2>{heading}</h2>
                <RawHTML html={paragraph} />
                <a className="btn primary" href={url}>
                    {text}
                </a>
                <img src={optimizedImage} alt="" />
            </div>
        </section>
    );
}

export function AllSubjectsAboutOpenStax() {
    const {aboutOs} = useSubjectsContext();

    return <AboutOpenStax aboutOs={aboutOs[0].value} />;
}
