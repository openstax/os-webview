import React from 'react';
import {books, types, advanced} from '../store';
import AccordionGroup from '~/components/accordion-group/accordion-group.jsx';
import BookOptions from '../controls/book-options/book-options';
import OptionsList from '../controls/options-list/options-list';
import Checkboxes from '../controls/checkboxes-linked-to-store/checkboxes-linked-to-store';
import sortBy from 'lodash/sortBy';
import './mobile-filters.css';

function TypeOptions({store, options}) {
    return (
        <OptionsList items={options} selected={store} />
    );
}

function AdvancedFilters({store, options}) {
    const items = sortBy(
        options.map((group) => ({
            title: group.title,
            contentComponent: <Checkboxes options={group.options} store={store} />
        })),
        'title'
    );
    return (
        <AccordionGroup items={items} noScroll={true} />
    );
}

export default function MobileFilters({typeOptions, advancedFilterOptions}) {
    const items = [
        {
            title: 'Books',
            contentComponent: <BookOptions store={books} />
        },
        {
            title: 'Type',
            contentComponent: <TypeOptions store={types} options={typeOptions} />
        },
        {
            title: 'Advanced Filters',
            contentComponent: <AdvancedFilters store={advanced} options={advancedFilterOptions} />
        }
    ];


    return (
        <div className="mobile controls mobile-filters">
            <AccordionGroup items={items} />
        </div>
    );
}
