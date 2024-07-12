import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './CardsBlock.scss';

type CardConfig = {
    type: 'corner_style';
    id: string;
    value: 'rounded' | 'square';
};

export type CardsBlockConfig = {
    id: string;
    type: 'cards';
    value: {
        text: string;
        image: {
            file: string;
            title: string;
        };
        cta: {
            text: string;
            link: [string];
            linkAriaLabel: string;
        };
        config: CardConfig[];
    };
};

export function CardsBlock({data}: {data: CardsBlockConfig}) {
    const cornerStyle = data.value.config.find(
        (entry) => entry.type === 'corner_style'
    );
    const {image, cta} = data.value;

    return (
        <div className={`content-block-cards ${cornerStyle?.value}`}>
            <RawHTML html={data.value.text} />
            {image.file && <img src={image.file} title={image.title} />}
            {cta.text && <a href={cta.link[0]}>{cta.text}</a>}
        </div>
    );
}
