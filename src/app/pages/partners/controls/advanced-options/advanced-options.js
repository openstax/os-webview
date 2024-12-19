import React from 'react';
import Checkboxes from '../checkboxes-linked-to-store/checkboxes-linked-to-store';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import sortBy from 'lodash/sortBy';

function checkedItemsCount(group, store) {
    return group.options.filter(({value}) => store.value.includes(value)).length;
}

export default function AdvancedOptions({store, options, onTabIndex}) {
    const items = sortBy(
        options
            .map((group) => ({
                title: group.title,
                titleTag: checkedItemsCount(group, store) || null,
                contentComponent: <Checkboxes options={group.options} store={store} />
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
