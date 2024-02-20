import React from 'react';
import Carousel from '~/components/carousel/carousel';
import './carousel-section.scss';

export default function CarouselSection({
    heading, description, linkUrl, linkText, children, thing
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
            <Carousel mobileSlider hoverTextThing={thing}>
                {children}
            </Carousel>
        </React.Fragment>
    );
}
