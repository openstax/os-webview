import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useOptimizedImage from '~/helpers/use-optimized-image';
import './banner.scss';

export default function Banner({
    data: {
        heading, subheading,
        headingDescription: description,
        headingButtonText: linkText,
        headingButtonLink: link,
        headingImage: {meta: {downloadUrl: image}}
    }
}) {
    const maxDim = window.innerWidth < 1920 ? 1920 : null;
    const optimizedImage = useOptimizedImage(image, maxDim);

    return (
        <section className="banner">
            <div className="background-image" style={{backgroundImage: `url(${optimizedImage})`}} />
            <div className="content-block">
                <div>
                    <h1>{heading}</h1>
                    <div><i>{subheading}</i></div>
                </div>
                <RawHTML class="text-content" html={description} />
                <a className="btn primary" href={link}>{linkText}</a>
            </div>
        </section>
    );
}
