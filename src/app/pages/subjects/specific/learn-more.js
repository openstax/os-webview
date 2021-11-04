import React from 'react';
import {useParams} from 'react-router-dom';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import './learn-more.scss';

function accordionItems() {
    return [
        // function Item({title, titleTag, checkChevronDirection, contentComponent}) {
        {
            title: 'General Business',
            contentComponent: <div>Our free introduction...</div>
        },
        {
            title: 'Accounting',
            contentComponent: <div>Some kind of thing about accounting...</div>
        }
    ];
}

export default function LearnMore() {
    const {subject} = useParams();

    return (
        <section id="learn" className="learn-more">
            <div className="content">
                <h1>Learn more about OpenStax {subject} textbooks</h1>
                <AccordionGroup items={accordionItems()} noScroll>
                </AccordionGroup>
            </div>
        </section>
    );
}
