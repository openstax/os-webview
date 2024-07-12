import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';

export interface RichTextBlockConfig {
    id: string;
    type: 'text';
    value: string;
}

export function RichTextBlock({data}: {data: RichTextBlockConfig}) {
    return <RawHTML className='content-block-rich-text' html={data.value} />;
}
