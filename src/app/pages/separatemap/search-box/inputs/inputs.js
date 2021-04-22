import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSlidersH} from '@fortawesome/free-solid-svg-icons/faSlidersH';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {faSearch} from '@fortawesome/free-solid-svg-icons/faSearch';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import cn from 'classnames';
import './inputs.scss';

function FilterToggleButton({filtersHidden, toggleFilters, children}) {
    return (
        <button className="filter-toggle" aria-pressed={!filtersHidden} onClick={() => toggleFilters()}>
            {
                filtersHidden ?
                    <FontAwesomeIcon icon={faSlidersH} className="filter-icon" /> :
                    <FontAwesomeIcon icon={faTimes} className="close-filters" />
            }
            {children}
        </button>
    );
}

function SearchAndClear({
    placeholder='Search by country, state, city, or institution name',
    textValue='',
    setTextValue
}) {
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
                placeholder={placeholder}
                value={textValue}
                onKeyDown={updateOnEnter}
            />
            <FontAwesomeIcon
                icon={faTimes} className="search-clear"
                role="button" tabIndex="0"
                hidden={clearIconHiddenFlag}
                onClick={() => setTextValue('')}
            />
        </div>
    );
}

function SearchIcon({minimized, toggle}) {
    const icon = minimized ? faSearch : faChevronLeft;

    return (
        <div
            className="search-icon" role="button" aria-pressed={minimized}
            tabIndex="0" onClick={() => toggle()}
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
        filtersHidden, toggleFilters
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
