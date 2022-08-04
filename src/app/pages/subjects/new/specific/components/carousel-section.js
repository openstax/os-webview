import React from 'react';
import Carousel from '~/components/carousel/carousel';
import './carousel-section.scss';

export default function CarouselSection({
    heading, description, linkUrl, linkText, children
}) {
    return (
        <React.Fragment>
            <div className="top">
                <h2>{heading}</h2>
                <div>{description}</div>
            </div>
            <a className="btn primary" href={linkUrl}>
                {linkText}
            </a>
            <Carousel mobileSlider>
                {children}
            </Carousel>
        </React.Fragment>
    );
}
