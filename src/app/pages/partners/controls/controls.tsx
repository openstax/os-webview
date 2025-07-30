import React, {useState, useEffect} from 'react';
import OptionsList, {Selected} from './options-list/options-list';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretUp} from '@fortawesome/free-solid-svg-icons/faCaretUp';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons/faCaretDown';
import BookOptions from './book-options/book-options';
import AdvancedOptions, {
    AdvancedOptionGroup
} from './advanced-options/advanced-options';
import type {OptionType} from '~/components/form-elements/form-elements';
import {useLocation} from 'react-router-dom';
import {useMainSticky} from '~/helpers/main-class-hooks';
import useSearchContext, {Store} from '../search-context';
import cn from 'classnames';
import './controls.scss';
import './button-with-popover.scss';

export const sortOptions = [
    {
        label: 'Name: A to Z',
        value: '1'
    },
    {
        label: 'Name: Z to A',
        value: '-1'
    }
];

export function BaseButton({
    label,
    openButton,
    setOpenButton,
    children,
    size = 0,
    fullScreen = false
}: React.PropsWithChildren<{
    label: string;
    openButton: string | null;
    setOpenButton: (s: string | null) => void;
    size?: number;
    fullScreen?: boolean;
}>) {
    const isOpen = openButton === label;
    const caretIcon = isOpen ? faCaretUp : faCaretDown;

    function toggle(event: React.MouseEvent) {
        event.stopPropagation();
        setOpenButton(isOpen ? null : label);
    }

    return (
        <div className={cn('button-with-popover', {detached: !children})}>
            <button
                className={cn({'has-selections': size > 0})}
                type="button"
                onClick={toggle}
                aria-pressed={isOpen}
            >
                <span>
                    {label}
                    {size > 0 && <span className="size">({size})</span>}
                </span>
                <FontAwesomeIcon icon={caretIcon} />
            </button>
            <div className={cn('popover', {fullScreen})}>
                {isOpen && children}
            </div>
        </div>
    );
}

function useLocationPreselects() {
    const location = useLocation();
    const [done, setDone] = React.useState(false);
    const {books, clearStores} = useSearchContext();

    React.useEffect(() => {
        if (!done) {
            setDone(true);
            clearStores();
            if (location.state?.book) {
                for (const book of Array.from(location.state.book)) {
                    books.toggle(book as string);
                }
            }
        }
    }, [location, done, books, clearStores]);

    React.useEffect(() => setDone(false), [location]);
}

export default function Controls({
    advancedFilterOptions,
    typeOptions
}: {
    advancedFilterOptions: AdvancedOptionGroup[];
    typeOptions: OptionType[];
}) {
    const [openTab, setOpenTab] = useState<number>();
    const [openButton, setOpenButton] = useState<string | null>(null);
    const commonButtonProps = {
        openButton,
        setOpenButton
    };
    const triangleClass = React.useMemo(() => {
        if (openButton !== 'Advanced Filters') {
            return 'triangle-white';
        }
        return openTab === 0 ? 'triangle-dark' : 'triangle-light';
    }, [openButton, openTab]);
    const {books, types, advanced, sort} = useSearchContext();

    useMainSticky();
    useLocationPreselects();

    useEffect(() => {
        function closeAnyOpenButton() {
            setOpenButton(null);
        }
        window.addEventListener('click', closeAnyOpenButton);

        return () => {
            window.removeEventListener('click', closeAnyOpenButton);
        };
    }, []);

    return (
        <section
            className="desktop controls"
            onClick={(e) => e.stopPropagation()}
        >
            <div className={`button-row ${triangleClass}`}>
                <BaseButton
                    label="Books"
                    {...commonButtonProps}
                    size={books.size}
                />
                <BaseButton
                    label="Type"
                    {...commonButtonProps}
                    size={types.size}
                >
                    <OptionsList
                        items={typeOptions}
                        selected={types as Selected}
                    />
                </BaseButton>
                <BaseButton
                    label="Advanced Filters"
                    {...commonButtonProps}
                    size={advanced.size}
                />
            </div>
            <div className="other-controls">
                <BaseButton label="Sort" {...commonButtonProps}>
                    <OptionsList
                        items={sortOptions}
                        selected={sort as Selected}
                    />
                </BaseButton>
            </div>
            <div className="popover-container">
                {openButton === 'Books' && (
                    <BookOptions store={books as Store} />
                )}
                {openButton === 'Advanced Filters' && (
                    <AdvancedOptions
                        store={advanced}
                        options={advancedFilterOptions}
                        onTabIndex={setOpenTab}
                    />
                )}
            </div>
        </section>
    );
}
