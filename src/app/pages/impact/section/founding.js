import React from 'react';
import {Section, HeadingAndDescription} from './section';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './founding.css';

export default function Founding({heading, description, portrait, caption}) {
    return (
        <Section id="founding">
            <div className="text-overlapping-photo">
                <img src={portrait.image} alt={portrait.altText} />
                <HeadingAndDescription
                    classList={['text-block', 'card']}
                    {...{heading, description}}
                />
            </div>
            <RawHTML className="caption hide-on-mobile" html={caption} />
        </Section>
    );
}
