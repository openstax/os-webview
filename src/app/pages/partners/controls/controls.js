import React, {useState, useEffect} from 'react';
import OptionsList from './options-list/options-list';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {books, types, advanced, sort, clearStores} from '../store';
import BookOptions from './book-options/book-options';
import AdvancedOptions from './advanced-options/advanced-options';
import cn from 'classnames';
import './controls.css';
import './button-with-popover.css';
import {on} from '~/helpers/controller/decorators';
import shellBus from '~/components/shell/shell-bus';

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

export function BaseButton({label, openButton, setOpenButton, children, size, modal=false}) {
    const isOpen = openButton === label;
    const caretDirection = isOpen ? 'up' : 'down';

    function toggle(event) {
        event.stopPropagation();
        setOpenButton(isOpen ? null : label);
    }

    return (
        <div className={cn('button-with-popover', {detached: !children, modal})}>
            <button
                className={cn({'has-selections': size > 0})}
                type="button" onClick={toggle}
                aria-pressed={isOpen}
            >
                <span>
                    {label}
                    {size > 0 && <span className="size">({size})</span>}
                </span>
                <FontAwesomeIcon icon={`caret-${caretDirection}`} />
            </button>
            <div className="popover">
                {isOpen && children}
            </div>
        </div>
    );
}

function preSelectBooks() {
    if (history.state && history.state.book) {
        for (const book of [].concat(history.state.book)) {
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
        preSelectBooks();

        return () => {
            window.removeEventListener('click', closeAnyOpenButton);
            shellBus.emit('no-sticky');
        };
    }, []);

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
