/* eslint-disable camelcase */
import * as blocks from '@openstax/flex-page-renderer/blocks/index';
import * as person from '@openstax/flex-page-os-blocks/blocks/PersonBlock';
import {FAQBlock} from './blocks/FAQBlock';
import {BookListBlock} from './blocks/BookListBlock';

// flex-page-renderer >=1.1.5 expects each block as a {Component, config} pair
// (it reads def.Component at render time). Our local custom blocks still use the
// older "component function + static .blockConfig" shape, so wrap them here.
// `person` (flex-page-os-blocks) already exports the {Component, config} shape.
export const blockMap = {
    ...blocks,
    person,
    faq: {Component: FAQBlock, config: FAQBlock.blockConfig},
    book_list: {Component: BookListBlock, config: BookListBlock.blockConfig}
} as const;
