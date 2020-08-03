import React from 'react';
import {Section, HeadingAndDescription} from './section';

export default function Disruption({heading, description, graph}) {
    return (
        <Section id="disruption" className="light">
            <HeadingAndDescription {...{heading, description}} />
            <div class="scroll-on-mobile">
                <img src={graph.image.image} alt={graph.imageAltText || graph.image.altText} />
            </div>
        </Section>
    );
}
