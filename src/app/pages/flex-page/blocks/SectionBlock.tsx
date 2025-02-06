import React from 'react';
import cn from 'classnames';
import { ContentBlocks, ContentBlockConfig } from './ContentBlock';
import Color from 'color';
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
    type: 'padding_top';
    value: string;
} | {
    type: 'padding_bottom';
    value: string;
} | {
    type: 'analytics_label';
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

// eslint-disable-next-line complexity
export function SectionBlock({data}: {data: SectionBlockConfig}) {
    const id = findByType(data.value.config, 'id')?.value;
    const textAlign = findByType(data.value.config, 'text_alignment')?.value;
    const backgroundColor = findByType(data.value.config, 'background_color')?.value;
    const padding = findByType(data.value.config, 'padding')?.value ?? 0;
    const paddingTop = findByType(data.value.config, 'padding_top')?.value;
    const paddingBottom = findByType(data.value.config, 'padding_bottom')?.value;
    const analytics = findByType(data.value.config, 'analytics_label')?.value;
    const isDark = backgroundColor && Color(backgroundColor).isDark(); // eslint-disable-line new-cap

    return <section
        id={id}
        className={cn('content-block-section', {'dark-background': isDark})}
        data-analytics-nav={analytics}
        style={{backgroundColor,
            '--padding-multiplier': padding,
            '--padding-top-multiplier': paddingTop,
            '--padding-bottom-multiplier': paddingBottom
        } as React.CSSProperties}
    >
        <div className="section-content" style={{textAlign}}>
          <ContentBlocks data={data.value.content} />
        </div>
    </section>;
}
