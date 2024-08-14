import React from 'react';
import cn from 'classnames';
import Color from 'color';
import { ContentBlocks, ContentBlockConfig } from './ContentBlock';
import { ImageFields, Image } from '../components/Image';
import { findByType } from '../utils';
import './HeroBlock.scss';

export type HeroConfigOptions = {
    type: 'padding';
    value: string;
} | {
    type: 'padding_top';
    value: string;
} | {
    type: 'padding_bottom';
    value: string;
} | {
    type: 'background_color';
    value: string;
} | {
    type: 'image_alignment';
    value: string;
} | {
    type: 'analytics_label';
    value: string;
} | {
    type: 'id';
    value: string;
};

export interface HeroBlockConfig {
    id: string;
    type: 'hero';
    value: {
      content: ContentBlockConfig[]
      image: ImageFields;
      imageAlt: string;
      config: HeroConfigOptions[]
    };
}

const parseAlignment = (alignment: string) => {
    if (alignment.includes('top')) {return 'flex-start';}
    if (alignment.includes('bottom')) {return 'flex-end';}
    return 'center';
};

export function HeroBlock({data}: {data: HeroBlockConfig}) {
    const id = findByType(data.value.config, 'id')?.value;
    const padding = findByType(data.value.config, 'padding')?.value ?? 0;
    const paddingTop = findByType(data.value.config, 'padding_top')?.value;
    const paddingBottom = findByType(data.value.config, 'padding_bottom')?.value;
    const backgroundColor = findByType(data.value.config, 'background_color')?.value;
    const isDark = backgroundColor && Color(backgroundColor).isDark(); // eslint-disable-line new-cap
    const analytics = findByType(data.value.config, 'analytics_label')?.value;
    const alignment = findByType(data.value.config, 'image_alignment')?.value.toLowerCase() ?? 'right';

    const imageRight = alignment.includes('right');
    const imageVerticalAlign = parseAlignment(alignment);

    return <section
        id={id}
        className={cn('content-block-hero', {'dark-background': isDark})}
        data-analytics-nav={analytics}
        style={{backgroundColor,
            '--padding-multiplier': padding,
            '--padding-top-multiplier': paddingTop,
            '--padding-bottom-multiplier': paddingBottom,
            '--image-vertical-align': imageVerticalAlign
        } as React.CSSProperties}
    >
        <div className="hero-inner-wrapper">
          {imageRight ? <>
            <div className="hero-content">
                <ContentBlocks data={data.value.content} />
            </div>
            <div className="hero-image-container">
                <Image
                    className="hero-image"
                    image={data.value.image}
                    alt={data.value.imageAlt}
                />
            </div>
          </> : <>
            <div className="hero-image-container">
                <Image
                    className="hero-image"
                    image={data.value.image}
                    alt={data.value.imageAlt}
                />
            </div>
            <div className="hero-content">
                <ContentBlocks data={data.value.content} />
            </div>
          </>}
        </div>
    </section>;
}
