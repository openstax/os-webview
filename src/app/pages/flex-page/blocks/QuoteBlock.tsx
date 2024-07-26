import React from 'react';
import { Image, ImageFields } from '../components/Image';
import { RichTextContent } from './RichTextBlock';
import './QuoteBlock.scss';

export interface QuoteBlockConfig {
    id: string;
    type: 'quote';
    value: {
        image: ImageFields;
        content: string;
        name: string;
        title?: string;
    };
}

export function QuoteBlock({data}: {data: QuoteBlockConfig}) {
    return <div className="content-block-quote">
        <Image image={data.value.image} />
        <RichTextContent html={data.value.content} />
        <div className="quotee">
            <span className="name">{data.value.name}</span>
            {data.value.title ? <span className="title">{data.value.title}</span> : null}
        </div>
    </div>;
}
