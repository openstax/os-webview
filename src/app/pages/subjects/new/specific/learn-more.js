import React from 'react';
import useSpecificSubjectContext from './context';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './learn-more.scss';

function learnMoreDataToAccordionItem({heading: title, text: html}) {
    return {
        title,
        contentComponent: <RawHTML html={html} />
    };
}

function LearnMore() {
    const {osTextbookHeading, osTextbookCategories} = useSpecificSubjectContext();
    const accordionItems = React.useMemo(
        () => osTextbookCategories[0].map(learnMoreDataToAccordionItem),
        [osTextbookCategories]
    );

    return (
        <React.Fragment>
            <h2>{osTextbookHeading}</h2>
            <AccordionGroup items={accordionItems} noScroll />
        </React.Fragment>
    );
}

export default function MaybeLearnMore() {
    const ctx = useSpecificSubjectContext();

    if (!ctx?.osTextbookHeading) {
        return null;
    }
    return (<LearnMore />);
}
