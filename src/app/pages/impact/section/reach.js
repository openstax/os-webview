import React from 'react';
import {Section, HeadingAndDescription} from './section';
import './reach.css';

function FactBox({fact}) {
    return (
        <div class="card">
            <div class="color-header"></div>
            <div class="card-content">
                <div class="card-header">
                    {fact.number}<span class="smaller">{fact.unit}</span>
                </div>
                <div>{fact.text}</div>
            </div>
        </div>
    );
}

export default function Reach({heading, description, facts}) {
    return (
        <Section id="reach">
            <HeadingAndDescription classList={['text-block']} {...{heading, description}} />
            <div class="fact-boxes scroll-on-mobile">
                {facts.map((fact) => <FactBox fact={fact} key={fact.text} />)}
            </div>
        </Section>
    );
}
