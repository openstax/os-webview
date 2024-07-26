import React from 'react';
import {htmlToText} from '~/helpers/data';
import RawHTML from '~/components/jsx-helpers/raw-html';
import AccordionGroup from '~/components/accordion-group/accordion-group';
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
        }
    }>;
}

export function FAQBlock({data}: {data: FAQBlockConfig}) {
    const accordionItems = React.useMemo(() =>
        data.value.map((d) => ({
            title: htmlToText(d.value.question),
            contentComponent: <RawHTML html={d.value.answer} />
        }))
    , [data]);

    return <div className="content-block-faq">
        <div className="articles">
            <AccordionGroup items={accordionItems} noScroll forwardOnChange={false} />
        </div>
    </div>;
}
