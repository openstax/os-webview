import React from 'react';
import cn from 'classnames';
import { RichTextContent } from './RichTextBlock';
import { findByType } from '../utils';
import { CTALinkFields, CTALink } from './CTABlock';
import './CardsBlock.scss';

type CardConfig = {
    type: 'card_style';
    id: string;
    value: 'rounded' | 'square';
} | {
    type: 'card_size';
    id: string;
    value: string;
};

export type CardBlockConfig = {
  text: string;
  ctaBlock: CTALinkFields[];
};

export type CardsBlockConfig = {
    id: string;
    type: 'cards_block';
    value: {
        cards: CardBlockConfig[];
        config: CardConfig[];
    };
};

export function CardsBlock({data}: {data: CardsBlockConfig}) {
    const cardStyle = findByType(data.value.config, 'card_style')?.value;
    const styleClass = cardStyle ? `card_style_${cardStyle}` : undefined;
    const cardSize = findByType(data.value.config, 'card_size')?.value;

    return (
        <div
            className={cn('content-block-cards', styleClass)}
            style={{'--card-size': cardSize} as React.CSSProperties}
        >
            {data.value.cards.map((card, i) => <CardBlock key={i} data={card} />)}
        </div>
    );
}

export function CardBlock({data}: {data: CardBlockConfig}) {
    const [cta] = data.ctaBlock;

    return <div className="content-block-card">
        <RichTextContent html={data.text} />
        {cta ? <CTALink link={cta} /> : null}
    </div>;
}
