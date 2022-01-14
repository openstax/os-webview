import React from 'react';
import useSpecificSubjectContext from './context';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './learn-more.scss';

function learnMoreDataToAccordionItem({title, html}) {
    return {
        title,
        contentComponent: <RawHTML html={html} />
    };
}

export default function LearnMore({subjectName}) {
    const {introHtml, learnMore} = useSpecificSubjectContext();
    const accordionItems = React.useMemo(
        () => learnMore.map(learnMoreDataToAccordionItem),
        [learnMore]
    );

    return (
        <section id="learn" className="learn-more">
            <div className="content">
                <h1>Learn more about OpenStax {subjectName} textbooks</h1>
                <RawHTML className="paragraph-html" html={introHtml} />
                <AccordionGroup items={accordionItems} noScroll />
            </div>
        </section>
    );
}
