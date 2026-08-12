/* eslint-disable camelcase */
import * as blocks from '@openstax/flex-page-renderer/blocks/index';
import {FAQBlock} from './blocks/FAQBlock';
import {BookListBlock} from './blocks/BookListBlock';
import {TableResourceLinksBlock, tableDelegate} from './blocks/TableResourceLinksBlock';

// flex-page-renderer >=1.1.5 expects each block as a {Component, config} pair
// (it reads def.Component at render time). Our local custom blocks still use the
// older "component function + static .blockConfig" shape, so wrap them here.
export const blockMap = {
    ...blocks,
    faq: {Component: FAQBlock, config: FAQBlock.blockConfig},
    book_list: {Component: BookListBlock, config: BookListBlock.blockConfig},
    // `table` isn't in the renderer version this app currently pins (that
    // bump is a separate change - see TableResourceLinksBlock.tsx). Only
    // register the override once the real block exists so this stays a no-op
    // today instead of crashing on `blocks.table.config`.
    ...(tableDelegate ? {table: {Component: TableResourceLinksBlock, config: tableDelegate.config}} : {})
} as const;
