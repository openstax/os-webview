import React from 'react';
import useSpecificSubjectContext from './context';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
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

export default function LearnMore({subjectName}) {
    const {introHtml} = useSpecificSubjectContext();

    return (
        <section id="learn" className="learn-more">
            <div className="content">
                <h1>Learn more about OpenStax {subjectName} textbooks</h1>
                <RawHTML className="paragraph-html" html={introHtml} />
                <AccordionGroup items={accordionItems()} noScroll />
            </div>
        </section>
    );
}
