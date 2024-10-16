import React from 'react';
import useSubjectsContext, {ImageData} from './context';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useOptimizedImage from '~/helpers/use-optimized-image';
import './tutor-ad.scss';

export type TutorValue = {
    heading: string;
    image: ImageData;
    adHtml: string;
    linkHref: string;
    linkText: string;
};

export function TutorAdThatTakesData({
    heading,
    image,
    adHtml,
    linkHref,
    linkText
}: TutorValue) {
    const optimizedImage = useOptimizedImage(image?.file, 400);

    return (
        <section className="tutor-ad">
            <div className="content">
                <h2>{heading}</h2>
                <img role="presentation" src={optimizedImage} />
                <RawHTML html={adHtml} />
                <a data-analytics-link className="btn primary" href={linkHref}>
                    {linkText}
                </a>
            </div>
        </section>
    );
}

export default function TutorAd() {
    const {tutorAd} = useSubjectsContext();
    const {image, heading, adHtml, linkHref, linkText} = tutorAd[0].value;

    return (
        <TutorAdThatTakesData
            {...{heading, image, adHtml, linkHref, linkText}}
        />
    );
}
