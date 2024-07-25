import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './RichTextBlock.scss';

export interface RichTextBlockConfig {
    id: string;
    type: 'text';
    value: string;
}

export function RichTextContent({html}: {html: string}) {
    return <RawHTML className='content-block-rich-text' html={html} />;
}

export function RichTextBlock({data}: {data: RichTextBlockConfig}) {
    return <RichTextContent html={data.value} />;
}
