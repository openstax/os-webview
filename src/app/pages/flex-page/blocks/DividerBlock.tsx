import React from 'react';
import { ImageFields, Image } from '../components/Image';
import cn from 'classnames';
import { findByType } from '../utils';
import './DividerBlock.scss';

export type DividerConfigOptions = {
    type: 'width';
    value: string;
} | {
    type: 'height';
    value: string;
} | {
    type: 'alignment';
    value: string;
} | {
    type: 'offset_vertical';
    value: string;
} | {
    type: 'offset_horizontal';
    value: string;
}

export interface DividerBlockConfig {
    id: string;
    type: 'divider';
    value: {
        image: ImageFields;
        config: DividerConfigOptions[]
    };
}

function getTransform(config: DividerConfigOptions[]) {
    const offsetVertical = findByType(config, 'offset_vertical')?.value ?? '-50%';
    const offsetHorizontal = findByType(config, 'offset_horizontal')?.value ?? '0px';

    return `translateY(${offsetVertical}) translateX(${offsetHorizontal})`;
}

export function DividerBlock({data}: {data: DividerBlockConfig}) {
    const width = findByType(data.value.config, 'width')?.value;
    const height = findByType(data.value.config, 'height')?.value;
    const alignment = findByType(data.value.config, 'alignment')?.value;
    const alignmentClass = alignment ? `align_${alignment}` : null;
    const transform = getTransform(data.value.config);

    return <div className={cn('content-block-divider', alignmentClass)}>
        <Image
            style={{width, height, transform}}
            className="divider-image"
            image={data.value.image}
            alt=""
        />
    </div>;
}
