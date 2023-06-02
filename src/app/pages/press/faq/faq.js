import React from 'react';
import usePageContext from '../page-context';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import {htmlToText} from '~/helpers/data';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './faq.scss';

export default function FAQ() {
    const {faqs} = usePageContext();

    const accordionItems = React.useMemo(
        () =>
            faqs.map((d) => ({
                title: htmlToText(d.question),
                contentComponent: <RawHTML html={d.answer} />
            })),
        [faqs]
    );

    return (
        <div className='content-block'>
            <h2>Frequently asked questions</h2>
            <div className='articles'>
                <AccordionGroup items={accordionItems} noScroll />
            </div>
        </div>
    );
}
