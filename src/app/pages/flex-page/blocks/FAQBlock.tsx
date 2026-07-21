import React from 'react';
import {htmlToText} from '~/helpers/data';
import RawHTML from '~/components/jsx-helpers/raw-html';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import {ContentBlockRoot, type BlockData} from '@openstax/flex-page-renderer/ContentBlockRoot';
import * as blocks from '@openstax/flex-page-renderer/blocks/index';
import {Image, type ImageFields} from '@openstax/flex-page-renderer/components/Image';
import './FAQBlock.scss';

// The CMS's faq.content field is a closed StreamBlock: table, image, or text.
// table/text are registered renderer blocks (delegate to ContentBlockRoot);
// image isn't a block type in the renderer's registry, so it needs its own case.
type FAQImageItem = {id: string; type: 'image'; value: {image: ImageFields; alt_text: string}};
type FAQContentItem = FAQImageItem | BlockData<typeof blocks>[number];

const isFAQImage = (item: FAQContentItem): item is FAQImageItem => item.type === 'image';

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

export function FAQBlock({data}: {data: FAQBlockConfig}): React.ReactElement {
    const accordionItems = React.useMemo(() =>
        data.value.map((d) => ({
            title: htmlToText(d.value.question),
            contentComponent: <>
                <RawHTML html={d.value.answer} />
                {(d.value.content ?? []).map((item) => isFAQImage(item)
                    ? <Image key={item.id} image={item.value.image} alt={item.value.alt_text} />
                    : <ContentBlockRoot key={item.id} data={[item]} blocks={blocks} />)}
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
