import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import './inputs.css';

function FilterToggleButton({filtersHidden, toggleFilters, children}) {
    return (
        <button className="filter-toggle" aria-pressed={!filtersHidden} onClick={() => toggleFilters()}>
            {
                filtersHidden ?
                    <FontAwesomeIcon icon="sliders-h" className="filter-icon" /> :
                    <FontAwesomeIcon icon="times" className="close-filters" />
            }
            {children}
        </button>
    );
}

function SearchAndClear({placeholder, textValue='', setTextValue}) {
    const clearIconHiddenFlag = textValue.length < 1;

    function updateOnEnter(event) {
        if (event.key === 'Enter') {
            setTextValue(event.target.value);
        }
    }

    return (
        <div className="search-and-clear">
            <input
                type="text" className="search-input"
                placeholder="Search by country, state, city, or institution name"
                value={textValue}
                onKeyDown={updateOnEnter}
            />
            <FontAwesomeIcon
                icon="times" className="search-clear"
                role="button" tabIndex="0"
                hidden={clearIconHiddenFlag}
                onClick={() => setTextValue('')}
            />
        </div>
    );
}

function SearchIcon({minimized, toggle}) {
    const icon = minimized ? 'search' : 'chevron-left';

    return (
        <div
            className="search-icon" role="button" aria-pressed={minimized}
            tabindex="0" onClick={() => toggle()}
        >
            <FontAwesomeIcon icon={icon} />
        </div>
    );
}

function InputView({
    className, placeholder, children,
    minimized, toggle, searchValue, setSearchValue, filtersHidden, toggleFilters
}) {
    return (
        <div className={cn(className, {minimized})}>
            <SearchIcon {...{minimized, toggle}} />
            <SearchAndClear
                placeholder={placeholder}
                textValue={searchValue} setTextValue={setSearchValue}
            />
            <FilterToggleButton {...{filtersHidden, toggleFilters}}>
                {children}
            </FilterToggleButton>
        </div>
    );
}

export default function Inputs({
    toggle, minimized, filtersHidden, toggleFilters, searchValue, setSearchValue
}) {
    const commonViewProps = {
        minimized, toggle, searchValue, setSearchValue,
        filtersHidden, toggleFilters, searchValue, setSearchValue
    };

    return (
        <div className="search-inputs">
            <InputView
                className="desktop-view"
                placeholder="Search by country, state, city, or institution name"
                {...commonViewProps}
            >
                <span className="filter-label">Filter by</span>
            </InputView>
            <InputView
                className="phone-view"
                placeholder="Institution name or location"
                {...commonViewProps}
            />
        </div>
    );
}

// export default class extends componentType(spec, busMixin) {
//
//     whenPropsUpdated(obj) {
//         if ('textValue' in obj) {
//             this.syncSearchInputs(this.textValue);
//         }
//         this.update();
//     }
//
//     syncSearchInputs(value) {
//         const els = Array.from(this.el.querySelectorAll('.search-input'));
//
//         els.forEach((el) => {
//             if (el.value !== value) {
//                 el.value = value;
//             }
//         });
//     }
//
//     @on('input .search-input')
//     handleInput(event) {
//         this.emit('search-value', event.delegateTarget.value);
//     }
//
//     @on('keypress .search-input')
//     handleReturn(event) {
//         if (event.key === 'Enter') {
//             this.emit('run-search');
//         }
//     }
//
//     @on('click .search-clear')
//     clearSearchInput() {
//         this.emit('search-value', '');
//         this.emit('run-search');
//     }
//
//     @on('click .search-icon')
//     toggleMinimize(event) {
//         this.emit('toggle-minimized');
//         event.delegateTarget.blur();
//     }
//
//     @on('click .filter-toggle')
//     toggleFilters(event) {
//         this.emit('filter-toggle');
//     }
//
//     @on('keypress [role="button"]')
//     simulateClick({delegateTarget: target, key, preventDefault}) {
//         $.treatSpaceOrEnterAsClick({target, key, preventDefault});
//     }
//
// }
