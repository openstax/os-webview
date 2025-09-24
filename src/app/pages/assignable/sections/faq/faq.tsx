import React from 'react';
import FAQSection from '~/components/faq-section/faq-section';
import {htmlToText} from '~/helpers/data';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './faq.scss';

type FAQItem = {
    question: string;
    answer: string;
};

type FAQProps = {
    data: {
        faqHeader: string;
        faqs: FAQItem[];
    };
};

export default function FAQ({data}: FAQProps) {
    const accordionItems = React.useMemo(
        () => data.faqs.map((d) => ({
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
