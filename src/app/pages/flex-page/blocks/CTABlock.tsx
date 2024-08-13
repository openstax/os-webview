import React from 'react';
import cn from 'classnames';
import { findByType } from '../utils';
import { Link, LinkFields } from '../components/Link';
import './CTABlock.scss';

type CTALinkConfig = {
  type: 'style';
  value: 'string';
}

export interface CTALinkFields extends LinkFields {
    config: CTALinkConfig[];
}

export function CTALink({link}: {link: CTALinkFields}) {
    const style = findByType(link.config, 'style')?.value;
    const styleClass = style ? `style-${style}` : style;

    return <Link
        link={link}
        className={cn('cta-link', styleClass, styleClass ? 'styled-button' : undefined)}
    />;
}

type CTAConfig = {
  type: 'analytics_label';
  value: string;
}

export interface CTABlockConfig {
    id: string;
    type: 'cta_block';
    value: {
        actions: CTALinkFields[];
        config: CTAConfig[];
    };
}

export function CTABlock({data}: {data: CTABlockConfig}) {
    const analytics = findByType(data.value.config, 'analytics_label')?.value;

    return <div className="content-block-cta-block" data-analytics-nav={analytics}>
        {data.value.actions.map((action, i) => <CTALink key={i} link={action} />)}
    </div>;
}
