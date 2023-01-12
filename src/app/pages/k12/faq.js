import React from 'react';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import './faq.scss';

const data = [
    {
        question: 'Is OpenStax content high quality?',
        answer: `Yes! OpenStax textbooks and ancillaries are developed and
        peer-reviewed by educators to ensure they are readable and accurate,
        meet the scope and sequence requirements of each course, and are
        available with the latest technology-based learning tools.`
    },
    {
        question: 'What is OER?',
        answer: `OER stands for Open Education Resources. The digital content
        on our site is free to access and openly licensed. This means you do
        not have to pay a fee per student or educator to use the materials.`
    }
];

export default function FAQ() {
    const accordionItems = React.useMemo(
        () => data.map((d) => ({
            title: d.question,
            contentComponent: <div>{d.answer}</div>
        })),
        []
    );

    return (
        <section className="faq">
            <div className='boxed'>
                <h1>Frequently Asked Questions</h1>
                <div className="articles">
                    <AccordionGroup items={accordionItems} noScroll />
                </div>
            </div>
        </section>
    );
}
