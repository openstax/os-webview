import React from 'react';
import {htmlToText} from '~/helpers/data';
import RawHTML from '~/components/jsx-helpers/raw-html';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import {ContentBlockRoot, BlockData} from '@openstax/flex-page-renderer/ContentBlockRoot';
import * as blocks from '@openstax/flex-page-renderer/blocks/index';
import './FAQBlock.scss';

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
            content?: BlockData<typeof blocks>;
        }
    }>;
}

export function FAQBlock({data}: {data: FAQBlockConfig}): React.ReactElement {
    const accordionItems = React.useMemo(() =>
        data.value.map((d) => ({
            title: htmlToText(d.value.question),
            contentComponent: <>
                <RawHTML html={d.value.answer} />
                {d.value.content?.length
                    ? <ContentBlockRoot data={d.value.content} blocks={blocks} />
                    : null}
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
