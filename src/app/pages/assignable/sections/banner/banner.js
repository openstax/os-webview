import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useOptimizedImage from '~/helpers/use-optimized-image';
import './banner.scss';

export default function Banner({
    data: {
        headingTitleImageUrl, subheading,
        headingDescription: description,
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
                    <img src={headingTitleImageUrl} className="title-image" alt="" />
                    <div><i>{subheading}</i></div>
                </div>
                <RawHTML className="text-content" html={description} />
            </div>
        </section>
    );
}
