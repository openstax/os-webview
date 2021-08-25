import React, {useState, useEffect} from 'react';
import OptionsList from './options-list/options-list';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretUp} from '@fortawesome/free-solid-svg-icons/faCaretUp';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons/faCaretDown';
import {books, types, advanced, sort, clearStores} from '../store';
import BookOptions from './book-options/book-options';
import AdvancedOptions from './advanced-options/advanced-options';
import {useHistory} from 'react-router-dom';
import cn from 'classnames';
import './controls.scss';
import './button-with-popover.scss';
import shellBus from '~/components/shell/shell-bus';

export const sortOptions = [
    {
        label: 'Name: A to Z',
        value: '1'
    },
    {
        label: 'Name: Z to A',
        value: '-1'
    },
    {
        label: 'Rating: High to Low',
        value: '-2'
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

function preSelectBooks(history) {
    console.info('HISTORY state', history.location.state);
    if (history.location.state?.book) {
        console.info('Preselect', history.location.state.book);
        for (const book of [].concat(history.location.state.book)) {
            books.toggle(book);
        }
    }
}

export function useStoreSize(store) {
    const [size, setSize] = useState(store.size);

    useEffect(() => {
        setSize(store.size);
        return store.on('notify', () => setSize(store.size));
    }, [store]);

    return size;
}

export default function Controls({advancedFilterOptions, typeOptions}) {
    const [openTab, setOpenTab] = useState();
    const [openButton, setOpenButton] = useState(null);
    const commonButtonProps = {
        openButton,
        setOpenButton
    };
    const bookSize = useStoreSize(books);
    const typeSize = useStoreSize(types);
    const advancedSize = useStoreSize(advanced);
    const history = useHistory();

    function triangleClass() {
        if (openButton !== 'Advanced Filters') {
            return 'triangle-white';
        }
        return (openTab === 0 ? 'triangle-dark' : 'triangle-light');
    }

    useEffect(() => {
        function closeAnyOpenButton() {
            setOpenButton(null);
        }
        window.addEventListener('click', closeAnyOpenButton);
        shellBus.emit('with-sticky');
        clearStores();
        preSelectBooks(history);

        return () => {
            window.removeEventListener('click', closeAnyOpenButton);
            shellBus.emit('no-sticky');
        };
    }, [history]);

    function stopClickPropagation(event) {
        event.stopPropagation();
    }

    return (
        <section className="desktop controls" onClick={stopClickPropagation}>
            <div className={`button-row ${triangleClass()}`}>
                <BaseButton label="Books" {...commonButtonProps} size={bookSize} />
                <BaseButton label="Type" {...commonButtonProps} size={typeSize}>
                    <OptionsList items={typeOptions} selected={types} />
                </BaseButton>
                <BaseButton label="Advanced Filters" {...commonButtonProps} size={advancedSize} />
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
                        store={advanced} options={advancedFilterOptions}
                        onTabIndex={setOpenTab}
                    />}
            </div>
        </section>
    );
}
