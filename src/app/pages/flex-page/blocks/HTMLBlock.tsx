import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';

export interface HTMLBlockConfig {
    id: string;
    type: 'html';
    value: string;
}

export function HTMLBlock({data}: {data: HTMLBlockConfig}) {
    return <RawHTML html={data.value} />;
}
