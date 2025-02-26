import React from 'react';
import Checkboxes from '../checkboxes-linked-to-store/checkboxes-linked-to-store';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import sortBy from 'lodash/sortBy';

function checkedItemsCount(group, store) {
    return group.options.filter(({value}) => store.value.includes(value)).length;
}

const tooltipText = `
This rating reflects the degree to which the product uses equity-minded
considerations to promote equitable student success and close attainment gaps
related to race and income. OpenStax Allies self-evaluate based on the CWiC+
rubric and are required to provide evidence of their answers, so their ratings
are limited by what they can report. For more detail and examples, consult the
CWiC+ Product Evaluation Rubric.`;

export default function AdvancedOptions({store, options, onTabIndex}) {
    const items = sortBy(
        options
            .map((group) => ({
                title: group.title,
                titleTag: checkedItemsCount(group, store) || null,
                contentComponent: <Checkboxes options={group.options} store={store} />,
                tooltipContent: group.title === 'Equity Rating' ? <div>{tooltipText}</div> : null
            })),
        'title'
    );

    function forwardOnChange(openTabs) {
        onTabIndex(items.findIndex((t) => t.title === openTabs[0]));
    }

    return (
        <AccordionGroup items={items} forwardOnChange={forwardOnChange} noScroll />
    );
}
