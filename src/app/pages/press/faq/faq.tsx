import React from 'react';
import {ContentBlock} from '../helpers';
import usePageContext from '../page-context';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import {htmlToText, assertDefined} from '~/helpers/data';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './faq.scss';

export default function FAQ() {
    const {faqs} = assertDefined(usePageContext());

    const accordionItems = React.useMemo(
        () =>
            faqs.map((d) => ({
                title: htmlToText(d.question),
                contentComponent: <RawHTML html={d.answer} />
            })),
        [faqs]
    );

    return (
        <ContentBlock title="Frequently asked questions">
            <div className="articles">
                <AccordionGroup items={accordionItems} noScroll />
            </div>
        </ContentBlock>
    );
}
