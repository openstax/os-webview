import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Quote from '~/components/quote/quote.jsx';
import JITLoad from '~/helpers/jit-load';

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

    return (
        <figure className={data.alignment}>
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

function Document({data}) {
    return (<JITLoad importFn={() => import('./pdf-unit.js')} data={data} />);
}


// Using CMS tags, which are not camel-case
/* eslint camelcase: 0 */
const bodyUnits = {
    paragraph: Paragraph,
    aligned_image: AlignedImage,
    pullquote: PullQuote,
    document: Document
};

export default function BodyUnit({unit}) {
    const Unit = bodyUnits[unit.type] || Paragraph;

    return (
        <Unit data={unit.value} />
    );
}
