import React from 'react';
import { ContentBlocks, ContentBlockConfig } from './ContentBlock';
import './SectionBlock.scss';

export interface SectionBlockConfig {
    id: string;
    type: 'section';
    value: ContentBlockConfig[];
}

export function SectionBlock({data}: {data: SectionBlockConfig}) {
    return <section className="content-block-section">
        <div className="section-content">
          <ContentBlocks data={data.value} />
        </div>
    </section>;
}
