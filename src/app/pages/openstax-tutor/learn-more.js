import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';

function ButtonBox({num, model}) {
    const url = model[`section7CtaLink${num}`];
    const text = model[`section7CtaText${num}`];
    const description = model[`section7CtaBlurb${num}`];

    return (
        <div class="button-box">
            <a class="btn" href={url}>{text}</a>
            <div class="smaller">{description}</div>
        </div>
    );
}

export default function LearnMore({model}) {
    return (
        <section id="learn-more">
            <div class="boxed">
                <h1>{model.section7Heading}</h1>
            </div>
            <div class="text-content">
                <div>{model.section7Subheading}</div>
                <div class="buttons-row">
                    {
                        [1, 2].map((num) => <ButtonBox num={num} key={num} model={model} />)
                    }
                </div>
            </div>
        </section>
    );
}
