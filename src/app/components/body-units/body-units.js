import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Quote from '~/components/quote/quote.jsx';

function Paragraph({data}) {
    return (
        <RawHTML html={data} />
    );
}

function AlignedImage({data}) {
    const {
        caption,
        image: {original: {src, alt}}
    } = data;
    const alignmentClass = ['left', 'right'].includes(data.alignment) ? data.alignment : '';

    return (
        <figure className={alignmentClass}>
            <img src={src} alt={alt} />
            <RawHTML Tag="figcaption" html={caption} />
        </figure>
    );
}

function PullQuote({data}) {
    const model = {
        image: {},
        content: data.quote,
        attribution: data.attribution
    };

    return (
        <Quote model={model} />
    );
}

// Using CMS tags, which are not camel-case
/* eslint camelcase: 0 */
const bodyUnits = {
    paragraph: Paragraph,
    aligned_image: AlignedImage,
    pullquote: PullQuote
};

export default function BodyUnit({unit}) {
    const Unit = bodyUnits[unit.type] || Paragraph;

    return (
        <Unit data={unit.value} />
    );
}
