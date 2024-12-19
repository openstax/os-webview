import React, {useState, useRef} from 'react';
import ActiveFilters from '../active-filters/active-filters';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import BookOptions from '../controls/book-options/book-options';
import OptionsList from '../controls/options-list/options-list';
import Checkboxes from '../controls/checkboxes-linked-to-store/checkboxes-linked-to-store';
import useWindowContext, {WindowContextProvider} from '~/contexts/window';
import {BaseButton, sortOptions} from '../controls/controls';
import useMainClassContext from '~/contexts/main-class';
import useSearchContext from '../search-context';
import sortBy from 'lodash/sortBy';
import cn from 'classnames';
import './mobile-controls.scss';

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
    const {books, types, advanced, resultCount, clearStores} = useSearchContext();
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
                    <AccordionGroup items={items} preExpanded={['Advanced Filters']} />
                </div>
            </div>
            <div className="button-row">
                <button type="button" onClick={clearStores}>Clear all</button>
                <button type="button" className="primary" onClick={onClose}>Apply</button>
            </div>
        </React.Fragment>
    );
}

function MobileFiltersToggle({typeOptions, advancedFilterOptions}) {
    const [openButton, setOpenButton] = useState(null);
    const commonButtonProps = {
        openButton,
        setOpenButton
    };
    const {books, types, advanced, sort} = useSearchContext();
    const bookSize = books.size;
    const typeSize = types.size;
    const advancedSize = advanced.size;
    const filterSize = bookSize + typeSize + advancedSize;
    const {setModal} = useMainClassContext();

    React.useEffect(
        () => {
            setModal(Boolean(openButton));

            return () => setModal(false);
        },
        [openButton, setModal]
    );

    return (
        <React.Fragment>
            <BaseButton label="Filters" {...commonButtonProps} fullScreen size={filterSize}>
                <MobileFilters
                    {...{typeOptions, advancedFilterOptions, bookSize, typeSize, advancedSize}}
                    onClose={() => setOpenButton(null)}
                />
            </BaseButton>
            <BaseButton label="Sort" {...commonButtonProps}>
                <OptionsList items={sortOptions} selected={sort} />
            </BaseButton>
        </React.Fragment>
    );
}

function MobileControlRow({advancedFilterOptions, typeOptions}) {
    const wcx = useWindowContext();
    const ref = useRef();
    const [stuck, setStuck] = useState(false);

    React.useEffect(() => {
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
