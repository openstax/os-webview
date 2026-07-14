import React from 'react';
import {htmlToText} from '~/helpers/data';
import RawHTML from '~/components/jsx-helpers/raw-html';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import * as blocks from '@openstax/flex-page-renderer/blocks/index';
import {Image} from '@openstax/flex-page-renderer/components/Image';
import './FAQBlock.scss';

interface FAQImageValue {
    image: {file: string; width: number; height: number};
    alt_text: string;
}

type FAQImageBlockConfig = {
    id: string;
    type: 'image';
    value: FAQImageValue;
};

type TableBlockConfig = Parameters<typeof blocks.table.Component>[0]['data'];
type RichTextBlockConfig = Parameters<typeof blocks.text.Component>[0]['data'];

type FAQContentItem =
    | TableBlockConfig
    | RichTextBlockConfig
    | FAQImageBlockConfig
    | {id: string; type: Exclude<string, 'table' | 'text' | 'image'>; value: unknown};
export interface FAQBlockConfig {
    id: string;
    type: 'faq';
    value: Array<{
        id: string;
        value: {
            question: string;
            slug: string;
            answer: string;
            document: unknown;
            content?: FAQContentItem[];
        }
    }>;
}

function FAQContent({item}: {item: FAQContentItem}): React.ReactElement | null {
    switch (item.type) {
        case 'table':
            return <blocks.table.Component data={item as TableBlockConfig} />;
        case 'text':
            return <blocks.text.Component data={item as RichTextBlockConfig} />;
        case 'image': {
            const {image, alt_text: altText} = (item as FAQImageBlockConfig).value;

            return <Image image={image} alt={altText} />;
        }
        default:
            return null;
    }
}

export function FAQBlock({data}: {data: FAQBlockConfig}): React.ReactElement {
    const accordionItems = React.useMemo(() =>
        data.value.map((d) => ({
            title: htmlToText(d.value.question),
            contentComponent: <>
                <RawHTML html={d.value.answer} />
                {(d.value.content ?? []).map((item) => <FAQContent key={item.id} item={item} />)}
            </>
        }))
    , [data]);

    return <div className="content-block-faq">
        <div className="articles">
            <AccordionGroup items={accordionItems} noScroll forwardOnChange={false} />
        </div>
    </div>;
}

FAQBlock.blockConfig = {type: 'faq' as const, label: 'FAQ', categories: [] as string[]};
