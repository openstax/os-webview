import React from 'react';
import {Section, HeadingAndDescription} from './section';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function Testimonial({info}) {
    return (
        <div className="card testimonial">
            <img src={info.image.image} alt={info.imageAltText || info.image.altText} />
            <div className="text-block">
                <div>{info.quote}</div>
                <a href={info.link}>
                    {info.linkText}
                    <FontAwesomeIcon icon="chevron-right" />
                </a>
            </div>
        </div>
    );
}

export default function Testimonials({heading, description, testimonials}) {
    return (
        <Section id="testimonials" className="light">
            <HeadingAndDescription {...{heading, description}} />
            <div className="testimonial-boxes">
                {testimonials.map((info) => <Testimonial info={info} key={info.quote} />)}
            </div>
        </Section>
    );
}
