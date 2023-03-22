import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useOptimizedImage from '~/helpers/use-optimized-image';
import './about.scss';

export default function About({
    heading, description, altText,
    image: {meta: {downloadUrl: image}}
}) {
    const optimizedImage = useOptimizedImage(image);

    return (
        <section className="about near-white">
            <div className="content-block">
                <div className="text-block">
                    <h2>{heading}</h2>
                    <RawHTML className="description-block" html={description} />
                </div>
                <img src={optimizedImage} alt={altText} />
            </div>
        </section>
    );
}
