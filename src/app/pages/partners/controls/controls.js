import React, {useState, useEffect} from 'react';
import OptionsList from './options-list/options-list';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {books, types, advanced, sort} from '../store';
import BookOptions from './book-options/book-options';
import AdvancedOptions from './advanced-options/advanced-options';
import cn from 'classnames';
import './controls.css';
import './button-with-popover.css';
import {on} from '~/helpers/controller/decorators';
import shellBus from '~/components/shell/shell-bus';

const sortOptions = [
    {
        label: 'A-Z',
        value: '1'
    },
    {
        label: 'Z-A',
        value: '-1'
    }
];

function BaseButton({label, openButton, setOpenButton, children}) {
    const isOpen = openButton === label;
    const caretDirection = isOpen ? 'up' : 'down';

    function toggle(event) {
        event.stopPropagation();
        setOpenButton(isOpen ? null : label);
    }

    return (
        <div className={cn('button-with-popover', {detached: !children})}>
            <button
                type="button" onClick={toggle}
                aria-pressed={isOpen}
            >
                <span>{label}</span>
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

export default function Controls({advancedFilterOptions, typeOptions}) {
    const [openTab, setOpenTab] = useState();
    const [openButton, setOpenButton] = useState(null);
    const commonButtonProps = {
        openButton,
        setOpenButton
    };

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
        [books, types, advanced].forEach((store) => store.clear());
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
                <BaseButton label="Books" {...commonButtonProps} />
                <BaseButton label="Type" {...commonButtonProps}>
                    <OptionsList items={typeOptions} selected={types} />
                </BaseButton>
                <BaseButton label="Advanced Filters" {...commonButtonProps} />
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
