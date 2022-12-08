import React, {useState, useEffect} from 'react';
import OptionsList from './options-list/options-list';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretUp} from '@fortawesome/free-solid-svg-icons/faCaretUp';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons/faCaretDown';
import BookOptions from './book-options/book-options';
import AdvancedOptions from './advanced-options/advanced-options';
import {useLocation} from 'react-router-dom';
import {useMainSticky} from '~/helpers/main-class-hooks';
import useSearchContext from '../search-context';
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

export function BaseButton({label, openButton, setOpenButton, children, size, fullScreen}) {
    const isOpen = openButton === label;
    const caretIcon = isOpen ? faCaretUp : faCaretDown;

    function toggle(event) {
        event.stopPropagation();
        setOpenButton(isOpen ? null : label);
    }

    return (
        <div className={cn('button-with-popover', {detached: !children})}>
            <button
                className={cn({'has-selections': size > 0})}
                type="button" onClick={toggle}
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

    React.useEffect(
        () => {
            if (!done) {
                setDone(true);
                clearStores();
                if (location.state?.book) {
                    for (const book of Array.from(location.state.book)) {
                        books.toggle(book);
                    }
                }
            }
        },
        [location, done, books, clearStores]
    );

    React.useEffect(
        () => setDone(false),
        [location]
    );
}

export default function Controls({advancedFilterOptions, typeOptions}) {
    const [openTab, setOpenTab] = useState();
    const [openButton, setOpenButton] = useState(null);
    const commonButtonProps = {
        openButton,
        setOpenButton
    };
    const triangleClass = React.useMemo(
        () => {
            if (openButton !== 'Advanced Filters') {
                return 'triangle-white';
            }
            return (openTab === 0 ? 'triangle-dark' : 'triangle-light');
        },
        [openButton, openTab]
    );
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
        <section className="desktop controls" onClick={(e) => e.stopPropagation()}>
            <div className={`button-row ${triangleClass}`}>
                <BaseButton label="Books" {...commonButtonProps} size={books.size} />
                <BaseButton label="Type" {...commonButtonProps} size={types.size}>
                    <OptionsList items={typeOptions} selected={types} />
                </BaseButton>
                <BaseButton label="Advanced Filters" {...commonButtonProps} size={advanced.size} />
            </div>
            <div className="other-controls">
                <BaseButton label="Sort" {...commonButtonProps}>
                    <OptionsList items={sortOptions} selected={sort} />
                </BaseButton>
            </div>
            <div className="popover-container">
                {openButton === 'Books' && <BookOptions store={books} />}
                {openButton === 'Advanced Filters' &&
                    <AdvancedOptions
                        store={advanced}
                        options={advancedFilterOptions}
                        onTabIndex={setOpenTab}
                    />}
            </div>
        </section>
    );
}
