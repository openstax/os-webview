import React from 'react';
import { RichTextContent } from './RichTextBlock';
import { LinkProps, Link } from '../components/Link';
import './CardsBlock.scss';

type CardConfig = {
    type: 'corner_style';
    id: string;
    value: 'rounded' | 'square';
};

export type CardBlockConfig = {
    id: string;
    type: 'card';
    value: {
        text: string;
        cta?: LinkProps;
    };
};

export type CardsBlockConfig = {
    id: string;
    type: 'cards';
    value: {
        cards: CardBlockConfig[];
        config: CardConfig[];
    };
};

const fakeCards: CardBlockConfig[] = [
    {type: 'card', value: {text: '<p>hello</p>', cta: {text: 'click me', target: [{value: 'https://google.com'}]}}, id: 'asdf1'},
    {type: 'card', value: {text: '<p>hello</p>'}, id: 'asdf2'},
    {type: 'card', value: {text: '<p>hello</p>', cta: {text: 'click me', target: [{value: 'https://google.com'}]}}, id: 'asdf3'}
];

export function CardsBlock({data}: {data: CardsBlockConfig}) {
    const cornerStyle = data.value.config.find(
        (entry) => entry.type === 'corner_style'
    );

    return (
        <div className={`content-block-cards ${cornerStyle?.value}`}>
            {fakeCards.map((card) => <CardBlock key={card.id} data={card} />)}
        </div>
    );
}

export function CardBlock({data}: {data: CardBlockConfig}) {
    return <div className="content-block-card">
        <RichTextContent html={data.value.text} />
        {data.value.cta ? <Link {...data.value.cta} /> : null}
    </div>;
}
