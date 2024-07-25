import React from 'react';
import { ContentBlocks, ContentBlockConfig } from './ContentBlock';
import { findByType } from '../utils';
import './SectionBlock.scss';

export type SectionConfigOptions = {
    type: 'text_alignment';
    value: 'left' | 'right' | 'center';
} | {
    type: 'background_color';
    value: string;
} | {
    type: 'padding';
    value: string;
} | {
    type: 'id';
    value: string;
};

export interface SectionBlockConfig {
    id: string;
    type: 'section';
    value: {
      content: ContentBlockConfig[]
      config: SectionConfigOptions[]
    };
}

export function SectionBlock({data}: {data: SectionBlockConfig}) {
    const id = findByType(data.value.config, 'id')?.value;
    const textAlign = findByType(data.value.config, 'text_alignment')?.value;
    const backgroundColor = findByType(data.value.config, 'background_color')?.value;
    const padding = findByType(data.value.config, 'padding')?.value ?? 0;

    return <section
        id={id}
        className="content-block-section"
        style={{backgroundColor, '--padding-multiplier': padding} as React.CSSProperties}
    >
        <div className="section-content" style={{textAlign}}>
          <ContentBlocks data={data.value.content} />
        </div>
    </section>;
}
