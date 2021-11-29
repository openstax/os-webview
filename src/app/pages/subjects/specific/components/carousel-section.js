import React from 'react';
import Carousel from '~/components/carousel/carousel';
import './carousel-section.scss';

export default function CarouselSection({
    id, className, heading, description, linkUrl, linkText, children
}) {
    return (
        <section id={id} className={className}>
            <div className="content">
                <div className="top">
                    <h1>{heading}</h1>
                    <div>{description}</div>
                </div>
                <a className="btn primary" href={linkUrl}>
                    {linkText}
                </a>
                <Carousel mobileSlider>
                    {children}
                </Carousel>
            </div>
        </section>
    );
}
