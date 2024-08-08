import React from 'react';
import cn from 'classnames';
import { findByType } from '../utils';
import { Link, LinkFields } from '../components/Link';
import './LinksBlock.scss';

type LinksConfig = {
  type: 'color';
  value: string;
} | {
  type: 'analytics_label';
  value: string;
}

export interface LinksBlockConfig {
    id: string;
    type: 'links_group';
    value: {
        links: LinkFields[];
        config: LinksConfig[];
    };
}

export function LinksBlock({data}: {data: LinksBlockConfig}) {
    const analytics = findByType(data.value.config, 'analytics_label')?.value;
    const color = findByType(data.value.config, 'color')?.value ?? 'white';
    const colorClass = `color-${color}`;

    return <div
        className={cn('content-block-links', colorClass)}
        data-analytics-nav={analytics}
    >
        {data.value.links.map((action, i) => <Link key={i} link={action} />)}
    </div>;
}
