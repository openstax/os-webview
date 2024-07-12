import React from 'react';
import { RichTextBlock, RichTextBlockConfig } from './RichTextBlock';
import { SectionBlock, SectionBlockConfig } from './SectionBlock';
import { CardsBlock, CardsBlockConfig } from './CardsBlock';

export type ContentBlockConfig =
    SectionBlockConfig |
    RichTextBlockConfig |
    CardsBlockConfig;

export function ContentBlocks({data}: {data: ContentBlockConfig[]}) {
    return <>
        {data.map((block) => <ContentBlock key={block.id} data={block} />)}
    </>;
}

export function ContentBlock({data}: {data: ContentBlockConfig}) {
    switch (data.type) {
        case 'text':
            return <RichTextBlock data={data} />;
        case 'section':
            return <SectionBlock data={data} />;
        case 'cards':
            return <CardsBlock data={data} />;
        default:
            return <pre>{JSON.stringify(data, null, 2)}</pre>;
    }
}
