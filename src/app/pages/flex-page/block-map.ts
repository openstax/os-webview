/* eslint-disable camelcase */
import React from 'react';
import * as blocks from '@openstax/flex-page-renderer/blocks/index';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {FAQBlock} from './blocks/FAQBlock';
import {BookListBlock} from './blocks/BookListBlock';

// The renderer's html block sets the markup with dangerouslySetInnerHTML, and
// innerHTML never executes <script> tags. RawHTML's `embed` mode re-creates them
// as fresh nodes so JavaScript authored in an html block actually runs.
const HTMLBlock = ({data}: {data: {value: string}}) =>
    React.createElement(RawHTML, {embed: true, html: data.value});

// flex-page-renderer >=1.1.5 expects each block as a {Component, config} pair
// (it reads def.Component at render time). Our local custom blocks still use the
// older "component function + static .blockConfig" shape, so wrap them here.
export const blockMap = {
    ...blocks,
    html: {Component: HTMLBlock, config: blocks.html.config},
    faq: {Component: FAQBlock, config: FAQBlock.blockConfig},
    book_list: {Component: BookListBlock, config: BookListBlock.blockConfig}
} as const;
