import React, {useState, useRef} from 'react';
import ActiveFilters from '../active-filters/active-filters';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import BookOptions from '../controls/book-options/book-options';
import OptionsList, {Selected} from '../controls/options-list/options-list';
import Checkboxes from '../controls/checkboxes-linked-to-store/checkboxes-linked-to-store';
import PutAway from '~/components/put-away/put-away';
import useWindowContext, {WindowContextProvider} from '~/contexts/window';
import {BaseButton, sortOptions} from '../controls/controls';
import useMainClassContext from '~/contexts/main-class';
import useSearchContext, {Store} from '../search-context';
import { AdvancedOptionGroup } from '../controls/advanced-options/advanced-options';
import type {OptionType} from '~/components/form-elements/form-elements';
import sortBy from 'lodash/sortBy';
import cn from 'classnames';
import './mobile-controls.scss';
import { assertDefined } from '~/helpers/data';

function TypeOptions({store, options}: {
    store: Store;
    options: OptionType[];
}) {
    return (
        <OptionsList items={options} selected={store as Selected} />
    );
}

function titleTag(size: number) {
    return size ? `(${size})` : null;
}

function AdvancedFilters({store, options}: {
    store: Store & {value: string[]};
    options: AdvancedOptionGroup[];
}) {
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
}: {
    typeOptions: OptionType[];
    advancedFilterOptions: AdvancedOptionGroup[];
    onClose: () => void;
    bookSize: number;
    typeSize: number;
    advancedSize: number;
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
                    <PutAway onClick={onClose} ariaLabel='close' />
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

function MobileFiltersToggle({typeOptions, advancedFilterOptions}: {
advancedFilterOptions: AdvancedOptionGroup[];
    typeOptions: OptionType[];
}) {
    const [openButton, setOpenButton] = useState<string | null>(null);
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
                <OptionsList items={sortOptions} selected={sort as Selected} />
            </BaseButton>
        </React.Fragment>
    );
}

function MobileControlRow({advancedFilterOptions, typeOptions}: {
    advancedFilterOptions: AdvancedOptionGroup[];
    typeOptions: OptionType[];
}) {
    const wcx = useWindowContext();
    const ref = useRef<HTMLDivElement>(null);
    const [stuck, setStuck] = useState(false);

    React.useEffect(() => {
        const rect = assertDefined(ref.current?.getBoundingClientRect());

        setStuck(rect.top <= 50);
    }, [wcx, ref]);

    return (
        <div className={cn('mobile-control-row', {stuck})} ref={ref}>
            <ActiveFilters advancedFilterOptions={advancedFilterOptions} />
            <MobileFiltersToggle {...{advancedFilterOptions, typeOptions}} />
        </div>
    );
}

export default function MobileControlRowWrapper(props: Parameters<typeof MobileControlRow>[0]) {
    return (
        <WindowContextProvider>
            <MobileControlRow {...props} />
        </WindowContextProvider>
    );
}
