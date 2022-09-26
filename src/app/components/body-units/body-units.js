import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import Quote from '~/components/quote/quote.js';
import JITLoad from '~/helpers/jit-load';

function Unknown({data, type}) {
    console.warn('Unknown data type', type);

    return (
        <RawHTML className="unknown-type" html={JSON.stringify(data)} />
    );
}

function convertAlignment(a) {
    return a.replace('1/2', 'half').replace('1/3', 'third');
}

function CTA({data}) {
    const alignment = convertAlignment(data.alignment);

    return (
        <div className={`blog-cta ${alignment}`}>
            <h2>{data.heading}</h2>
            <div>{data.description}</div>
            <a className="btn primary" href={data.button_href}>{data.button_text}</a>
        </div>
    );
}

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
    const alignment = convertAlignment(data.alignment);

    return (
        <figure className={alignment}>
            <img src={src} alt={data.alt_text || alt} />
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
    aligned_html: Paragraph,
    aligned_image: AlignedImage,
    pullquote: PullQuote,
    document: Document,
    blog_cta: CTA
};

export default function BodyUnit({unit}) {
    const Unit = bodyUnits[unit.type] || Unknown;

    return (
        <Unit data={unit.value} type={unit.type} />
    );
}
