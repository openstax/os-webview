import React from 'react';
import cn from 'classnames';
import { findByType } from '../utils';
import { Link, LinkFields } from '../components/Link';
import './LinksBlock.scss';

type LinksConfig = {
  type: 'color';
  value: 'string';
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
    const color = findByType(data.value.config, 'color')?.value ?? 'white';
    const colorClass = `color-${color}`;

    return <div className={cn('content-block-links', colorClass)}>
        {data.value.links.map((action, i) => <Link key={i} link={action} />)}
    </div>;
}
