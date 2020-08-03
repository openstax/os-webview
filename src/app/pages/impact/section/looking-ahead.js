import React from 'react';
import {Section, HeadingAndDescription} from './section';

export default function LookingAhead({heading, description, image}) {
    return (
        <Section id="looking-ahead" className="light">
            <div className="text-left-photo-right">
                <HeadingAndDescription classList={['text-block']} {...{heading, description}} />
                <img src={image.image} alt={image.altText} />
            </div>
        </Section>
    );
}
