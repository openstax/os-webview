import React from 'react';
import {Section, HeadingAndDescription} from './section';

export default function Giving({heading, description, link, linkText}) {
    return (
        <Section id="giving" className="white">
            <HeadingAndDescription classList={['centered']} {...{heading, description}}>
                <a class="btn primary" href={link}>{linkText}</a>
            </HeadingAndDescription>
        </Section>
    );
}
