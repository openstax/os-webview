/* eslint-disable camelcase */
import * as blocks from '@openstax/flex-page-renderer/blocks/index';
import {FAQBlock} from './blocks/FAQBlock';
import {BookListBlock} from './blocks/BookListBlock';
import {TableResourceLinksBlock} from './blocks/TableResourceLinksBlock';

// flex-page-renderer >=1.1.5 expects each block as a {Component, config} pair
// (it reads def.Component at render time). Our local custom blocks still use the
// older "component function + static .blockConfig" shape, so wrap them here.
//
// `table` is overridden to supply resource_ref-marked cells (access-locked
// instructor/student resources) through the renderer's TableCellContext slot,
// so those cells render the real resource-box button (Give dialog +
// trackLink) instead of the CMS's static fallback link. Every other cell,
// and all of sorting/filtering/striping/row-limits, stays the delegate's own
// behavior untouched - see ./blocks/TableResourceLinksBlock.
export const blockMap = {
    ...blocks,
    faq: {Component: FAQBlock, config: FAQBlock.blockConfig},
    book_list: {Component: BookListBlock, config: BookListBlock.blockConfig},
    table: {Component: TableResourceLinksBlock, config: blocks.table.config}
} as const;
