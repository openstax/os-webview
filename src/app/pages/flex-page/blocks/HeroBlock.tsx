import React from 'react';
import { ContentBlocks, ContentBlockConfig } from './ContentBlock';
import { ImageFields, Image } from '../components/Image';
import { findByType } from '../utils';
import './HeroBlock.scss';

export type HeroConfigOptions = {
    type: 'padding';
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

export function HeroBlock({data}: {data: HeroBlockConfig}) {
    const padding = findByType(data.value.config, 'padding')?.value ?? 0;

    return <section
        className="content-block-hero"
        style={{'--padding-multiplier': padding} as React.CSSProperties}
    >
        <div className="hero-inner-wrapper">
          {/* the order of these children should change based on the image alignment config */}
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
        </div>
    </section>;
}
