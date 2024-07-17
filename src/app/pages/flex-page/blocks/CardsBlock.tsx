import React from 'react';
import cn from 'classnames';
import { RichTextContent } from './RichTextBlock';
import { Link, LinkFields } from '../components/Link';
import { findByType } from '../utils';
import './CardsBlock.scss';

type CardConfig = {
    type: 'corner_style';
    id: string;
    value: 'rounded' | 'square';
};

export type CardBlockConfig = {
  text: string;
  cta: Array<LinkFields>;
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
    const cardStyle = findByType(data.value.config, 'corner_style')?.value;
    const styleClass = cardStyle ? `card_style_${cardStyle}` : undefined;

    return (
        <div className={cn('content-block-cards', styleClass)}>
            {data.value.cards.map((card, i) => <CardBlock key={i} data={card} />)}
        </div>
    );
}

export function CardBlock({data}: {data: CardBlockConfig}) {
    return <div className="content-block-card">
        <RichTextContent html={data.text} />
        {data.cta[0] ? <Link link={data.cta[0]} /> : null}
    </div>;
}
