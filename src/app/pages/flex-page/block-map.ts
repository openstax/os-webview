/* eslint-disable camelcase */
import {
    cta_block, cards_block, divider, html, hero, links_group,
    quote, text, section, well, columns, tabbed_content, flex_page
} from '@openstax/flex-page-renderer/blocks';
import {FAQBlock} from './blocks/FAQBlock';
import {BookListBlock} from './blocks/BookListBlock';

export const blockMap = {
    cta_block, cards_block, divider, html, hero, links_group,
    quote, text, section, well, columns, tabbed_content, flex_page,
    faq: FAQBlock,
    book_list: BookListBlock
} as const;
