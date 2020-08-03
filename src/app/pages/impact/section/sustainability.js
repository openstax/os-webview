import React from 'react';
import {Section, HeadingAndDescription} from './section';

export default function Sustainability({heading, description, partners}) {
    return (
        <Section id="sustainability" className="white">
            <HeadingAndDescription {...{heading, description}} />
            <div class="scroll-on-mobile">
                <div class="icon-row">
                    {
                        partners.map((icon) =>
                            <img src={icon.image.image}
                                alt={icon.imageAltText || icon.image.altText}
                            />
                        )
                    }
                </div>
            </div>
        </Section>
    );
}
