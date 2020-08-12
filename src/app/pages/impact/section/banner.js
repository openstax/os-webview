import React from 'react';
import {Section} from './section';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';

export default function Banner({heading, description, giveText, backgroundImage}) {
    return (
        <Section id="banner" style={{backgroundImage: `url(${backgroundImage.image})`}}>
            <div class="banner content">
                <div class="text-block">
                    <h1>{heading}</h1>
                    <RawHTML class="hide-on-mobile" html={description} />
                    <a class="btn primary" href="/give">{giveText}</a>
                </div>
            </div>
        </Section>
    );
}
