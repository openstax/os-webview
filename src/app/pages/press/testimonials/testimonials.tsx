import React from 'react';
import usePageContext, {TestimonialData} from '../page-context';
import ClippedImage from '~/components/clipped-image/clipped-image';
import Carousel from '~/components/carousel/carousel';
import {assertDefined} from '~/helpers/data';
import './testimonials.scss';

function Card({data}: {data: TestimonialData}) {
    const {image, testimonial} = data;

    return (
        <div className='card'>
            <div className='picture-part'>
                {image && <ClippedImage src={image.file} alt={image.title} />}
            </div>
            <div className='text-part'>
                <div>{testimonial}</div>
            </div>
        </div>
    );
}

export default function Testimonials() {
    const ctx = assertDefined(usePageContext());
    const {testimonials: [testimonials]} = ctx;

    return (
        <div className='content-block'>
            <h2>Making an impact</h2>
            <Carousel atATime={2} hoverTextThing='testimonials'>
                {testimonials.map((c: TestimonialData) => (
                    <Card data={c} key={c.image.file} />
                ))}
            </Carousel>
        </div>
    );
}
