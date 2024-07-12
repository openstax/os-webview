import React from 'react';

export interface RichTextBlockConfig {
  id: string;
  type: 'text';
  value: string;
}

export function RichTextBlock({data}: {data: RichTextBlockConfig}) {
    return <div className='content-block-rich-text' dangerouslySetInnerHTML={{ __html: data.value }} />;
}
