import React from 'react';
import { Link, LinkFields } from '../components/Link';
import './CTABlock.scss';

export interface CTABlockConfig {
    id: string;
    type: 'cta_block';
    value: {
        actions: LinkFields[];
    };
}

export function CTABlock({data}: {data: CTABlockConfig}) {
    const [primaryLink, secondaryLink] = data.value.actions;

    return <div className="content-block-cta-block">

        {/* need to style primary and secondary cta */}
        {primaryLink ? <Link link={primaryLink} /> : null}
        {secondaryLink ? <Link link={secondaryLink} /> : null}
    </div>;
}
