/* eslint-disable camelcase */
import * as blocks from '@openstax/flex-page-renderer/blocks/index';
import {FAQBlock} from './blocks/FAQBlock';
import {BookListBlock} from './blocks/BookListBlock';

export const blockMap = {
    ...blocks,
    faq: FAQBlock,
    book_list: BookListBlock
} as const;
