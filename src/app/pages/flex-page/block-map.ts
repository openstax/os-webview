/* eslint-disable camelcase */
import * as blocks from '@openstax/flex-page-renderer/blocks/index';
import {FAQBlock} from './blocks/FAQBlock';
import {BookListBlock} from './blocks/BookListBlock';

// flex-page-renderer >=1.1.5 expects each block as a {Component, config} pair
// (it reads def.Component at render time). Our local custom blocks still use the
// older "component function + static .blockConfig" shape, so wrap them here.
//
// NOTE: `table` is deliberately NOT overridden here yet. Substituting a resolved
// instructor-resource URL into the renderer's default cell yields a bare <a>,
// which drops the Give dialog and — silently, which is worse — the trackLink
// call that posts to /salesforce/download-tracking/ and creates the
// user-behavior adoption record. Resolution logic lives in
// ./blocks/table-resource-links-utils and gets wired up once
// flex-page-renderer exposes a per-cell render slot, so the cell can render the
// real resource-box button. Do not register a `table` override that only
// rewrites cell data.
export const blockMap = {
    ...blocks,
    faq: {Component: FAQBlock, config: FAQBlock.blockConfig},
    book_list: {Component: BookListBlock, config: BookListBlock.blockConfig}
} as const;
