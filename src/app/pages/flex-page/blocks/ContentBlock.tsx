import React from 'react';
import { RichTextBlock, RichTextBlockConfig } from './RichTextBlock';
import { SectionBlock, SectionBlockConfig } from './SectionBlock';
import { CardsBlock, CardsBlockConfig } from './CardsBlock';
import { HeroBlockConfig, HeroBlock } from './HeroBlock';
import { DividerBlockConfig, DividerBlock } from './DividerBlock';
import { CTABlock, CTABlockConfig } from './CTABlock';
import { HTMLBlockConfig, HTMLBlock } from "./HTMLBlock";

export type ContentBlockConfig =
    CTABlockConfig |
    HeroBlockConfig |
    HTMLBlockConfig |
    DividerBlockConfig |
    SectionBlockConfig |
    RichTextBlockConfig |
    CardsBlockConfig;

export function ContentBlocks({data}: {data: ContentBlockConfig[]}) {
    return <>
        {data.map((block) => <ContentBlock key={block.id} data={block} />)}
    </>;
}

// eslint-disable-next-line complexity
export function ContentBlock({data}: {data: ContentBlockConfig}) {
    switch (data.type) {
        case 'hero':
            return <HeroBlock data={data} />;
        case 'html':
            return <HTMLBlock data={data} />;
        case 'cta_block':
            return <CTABlock data={data} />;
        case 'divider':
            return <DividerBlock data={data} />;
        case 'text':
            return <RichTextBlock data={data} />;
        case 'section':
            return <SectionBlock data={data} />;
        case 'cards_block':
           return <CardsBlock data={data} />;
        default:
            return <pre>{JSON.stringify(data, null, 2)}</pre>;
    }
}
