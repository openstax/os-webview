import React from 'react';
import { ContentBlocks, ContentBlockConfig } from './ContentBlock';

export interface SectionBlockConfig {
  id: string;
  type: 'section';
  value: ContentBlockConfig[];
}

export function SectionBlock({data}: {data: SectionBlockConfig}) {
    return <section className="content-block-section">
        <ContentBlocks data={data.value} />
    </section>;
}
