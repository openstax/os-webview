import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import Quote from '~/components/quote/quote';
import JITLoad from '~/helpers/jit-load';

function Unknown({data, type}: {data: unknown; type: string}) {
    console.warn('Unknown data type', type);

    return <RawHTML className="unknown-type" html={JSON.stringify(data)} />;
}

function convertAlignment(a: string) {
    return a.replace('1/2', 'half').replace('1/3', 'third');
}

type CTAData = {
    alignment: string;
    heading: string;
    description: string;
    button_href: string;
    button_text: string;
}

function CTA({data}: {data: CTAData}) {
    const alignment = convertAlignment(data.alignment);

    return (
        <div className={`blog-cta ${alignment}`}>
            <h2>{data.heading}</h2>
            <div>{data.description}</div>
            <a className="btn primary" href={data.button_href}>
                {data.button_text}
            </a>
        </div>
    );
}

function Paragraph({data}: {data: string}) {
    return <RawHTML html={data} />;
}

type AImageData = {
    caption: string;
    image: {
        original: {
            src: string;
            alt: string;
        }
    };
    alignment: string;
    alt_text: string;
};

function AlignedImage({data}: {data: AImageData}) {
    const {
        caption,
        image: {
            original: {src, alt}
        }
    } = data;
    const alignment = convertAlignment(data.alignment);

    return (
        <figure className={alignment}>
            <img src={src} alt={data.alt_text || alt} />
            <RawHTML Tag="figcaption" html={caption} />
        </figure>
    );
}

type PQData = {
    quote: string;
    attribution: string;
}

function PullQuote({data}: {data: PQData}) {
    const model = {
        image: {},
        content: data.quote,
        attribution: data.attribution
    };

    return <Quote model={model} />;
}


export type DocumentData = {
    download_url: string;
}

function Document({data}: {data: DocumentData}) {
    return <JITLoad importFn={() => import('./import-pdf-unit.js')} data={data} />;
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

export type UnitType = {
    id: string;
} & ({
    type: 'paragraph' | 'aligned_html';
    value: string;
} | {
    type: 'aligned_image';
    value: AImageData;
} | {
    type: 'pullquote';
    value: PQData;
} | {
    type: 'document';
    value: DocumentData;
} | {
    type: 'blog_cta';
    value: CTAData;
})

export default function BodyUnit({unit}: {unit: UnitType}) {
    const Unit = bodyUnits[unit.type] as ({data}: {data: typeof unit.value}) => React.JSX.Element;

    return Unit ? <Unit data={unit.value} /> : <Unknown data={unit.value} type={unit.type} />;
}
