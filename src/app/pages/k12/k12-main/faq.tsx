import React from 'react';
import FAQSection from '~/components/faq-section/faq-section';
import type {K12Data} from './k12-main';
import {htmlToText} from '~/helpers/data';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './faq.scss';

export default function FAQ({data}: {data: K12Data}) {
    const accordionItems = React.useMemo(
        () =>
            data.faqs.map((d) => ({
                title: htmlToText(d.question),
                contentComponent: <RawHTML html={d.answer} />
            })),
        [data.faqs]
    );

    return (
        <section className="faq">
            <FAQSection heading={data.faqHeader} items={accordionItems} />
        </section>
    );
}
