import React from 'react';
import usePageContext from '../page-context';
import ClippedImage from '~/components/clipped-image/clipped-image';
import Carousel from '~/components/carousel/carousel';
import './testimonials.scss';

function Card({data: {image, testimonial}}) {
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
    const {testimonials: [testimonials]} = usePageContext();

    return (
        <div className='content-block'>
            <h2>Making an impact</h2>
            <Carousel atATime={2} mobileSlider hoverTextThing='testimonials'>
                {testimonials.map((c) => (
                    <Card data={c} key={c.description} />
                ))}
            </Carousel>
        </div>
    );
}
