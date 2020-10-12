import React, {useState, useContext, useRef, useEffect, useLayoutEffect} from 'react';
import {books, types, advanced, resultCount, clearStores, sort} from '../store';
import ActiveFilters from '../active-filters/active-filters';
import AccordionGroup from '~/components/accordion-group/accordion-group.jsx';
import BookOptions from '../controls/book-options/book-options';
import OptionsList from '../controls/options-list/options-list';
import Checkboxes from '../controls/checkboxes-linked-to-store/checkboxes-linked-to-store';
import {WindowContext, WindowContextProvider} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {BaseButton, useStoreSize, sortOptions} from '../controls/controls';
import shellBus from '~/components/shell/shell-bus';
import sortBy from 'lodash/sortBy';
import cn from 'classnames';
import './mobile-controls.css';

function TypeOptions({store, options}) {
    return (
        <OptionsList items={options} selected={store} />
    );
}

function titleTag(size) {
    return size ? `(${size})` : null;
}

function AdvancedFilters({store, options}) {
    const items = sortBy(
        options.map((group) => {
            const groupValues = group.options.map((opt) => opt.value);
            const selectedsFoundInGroup = store.value.filter((sv) => groupValues.includes(sv)).length;

            return ({
                title: group.title,
                contentComponent: <Checkboxes options={group.options} store={store} />,
                titleTag: titleTag(selectedsFoundInGroup)
            });
        }),
        'title'
    );

    return (
        <AccordionGroup items={items} noScroll={true} />
    );
}

function MobileFilters({
    typeOptions, advancedFilterOptions, onClose, bookSize, typeSize, advancedSize
}) {
    const items = [
        {
            title: 'Books',
            contentComponent: <BookOptions store={books} />,
            titleTag: titleTag(bookSize)
        },
        {
            title: 'Type',
            contentComponent: <TypeOptions store={types} options={typeOptions} />,
            titleTag: titleTag(typeSize)
        },
        {
            title: 'Advanced Filters',
            contentComponent: <AdvancedFilters store={advanced} options={advancedFilterOptions} />,
            titleTag: titleTag(advancedSize)
        }
    ];

    return (
        <React.Fragment>
            <div className="filter-section">
                <div className="title-bar">
                    <span>Filters ({resultCount.value} results)</span>
                    <span className="put-away" onClick={onClose}>&times;</span>
                </div>
                <div className="mobile controls mobile-filters">
                    <AccordionGroup items={items} />
                </div>
            </div>
            <div className="button-row stuck">
                <button type="button" onClick={clearStores}>Clear all</button>
                <button type="button" className="primary" onClick={onClose}>Apply</button>
            </div>
        </React.Fragment>
    );
}

function FilterToggle({typeOptions, advancedFilterOptions}) {
    const [openButton, setOpenButton] = useState(null);
    const bookSize = useStoreSize(books);
    const typeSize = useStoreSize(types);
    const advancedSize = useStoreSize(advanced);
    const filterSize = bookSize + typeSize + advancedSize;

    useLayoutEffect(() => {
        shellBus.emit(openButton ? 'with-modal' : 'no-modal');
    }, [openButton]);

    return (
        <BaseButton label="Filters" {...{openButton, setOpenButton}} size={filterSize} modal>
            <MobileFilters
                {...{typeOptions, advancedFilterOptions, bookSize, typeSize, advancedSize}}
                onClose={() => setOpenButton(null)}
            />
        </BaseButton>
    );
}

function SortToggle() {
    const [openButton, setOpenButton] = useState(null);

    return (
        <BaseButton label="Sort" {...{openButton, setOpenButton}}>
            <OptionsList items={sortOptions} selected={sort} />
        </BaseButton>
    );
}

function MobileFiltersToggle({typeOptions, advancedFilterOptions}) {
    return (
        <React.Fragment>
            <FilterToggle {...{typeOptions, advancedFilterOptions}} />
            <SortToggle />
        </React.Fragment>
    );
}

function MobileControlRow({advancedFilterOptions, typeOptions}) {
    const wcx = useContext(WindowContext);
    const ref = useRef();
    const [stuck, setStuck] = useState(false);

    useEffect(() => {
        const rect = ref.current.getBoundingClientRect();

        setStuck(rect.top <= 50);
    }, [wcx, ref]);

    return (
        <div className={cn('mobile-control-row', {stuck})} ref={ref}>
            <ActiveFilters advancedFilterOptions={advancedFilterOptions} />
            <MobileFiltersToggle {...{advancedFilterOptions, typeOptions}} />
        </div>
    );
}

export default function MobileControlRowWrapper(props) {
    return (
        <WindowContextProvider>
            <MobileControlRow {...props} />
        </WindowContextProvider>
    );
}
