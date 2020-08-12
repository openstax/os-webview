import React from 'react';
import {Section, HeadingAndDescription} from './section';

export default function Sustainability({heading, description, partners}) {
    return (
        <Section id="sustainability" className="white">
            <HeadingAndDescription {...{heading, description}} />
            <div class="scroll-on-mobile">
                <div class="icon-row">
                    {
                        partners.map(({image, imageAltText}) =>
                            <img
                                src={image.image} key={image.image}
                                alt={imageAltText || image.altText}
                            />
                        )
                    }
                </div>
            </div>
        </Section>
    );
}
