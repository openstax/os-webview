import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSlidersH} from '@fortawesome/free-solid-svg-icons/faSlidersH';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {faSearch} from '@fortawesome/free-solid-svg-icons/faSearch';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import cn from 'classnames';
import './inputs.scss';

type CommonViewProps = {
    toggle: () => void;
    minimized: boolean;
    filtersHidden: boolean;
    toggleFilters: () => void;
    searchValue: string;
    setSearchValue: (s: string) => void;
}

function FilterToggleButton({filtersHidden, toggleFilters, children}: React.PropsWithChildren<
    Pick<CommonViewProps, 'filtersHidden' | 'toggleFilters'>
>) {
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
    placeholder,
    textValue,
    setTextValue
}: {
    placeholder: string;
    textValue: string;
    setTextValue: (s: string) => void;
}) {
    const clearIconHiddenFlag = textValue.length < 1;

    function updateOnEnter({key, target}: React.KeyboardEvent<HTMLInputElement>) {
        if (key === 'Enter') {
            setTextValue((target as HTMLInputElement).value);
        }
    }

    return (
        <div className="search-and-clear">
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={textValue}
                onKeyDown={updateOnEnter}
            />
            <button
                type="button"
                className="search-clear"
                aria-label="clear search"
                hidden={clearIconHiddenFlag}
                onClick={() => setTextValue('')}
            >
                <FontAwesomeIcon icon={faTimes} className="search-clear" />
            </button>
        </div>
    );
}

function SearchIcon({minimized, toggle}: Pick<CommonViewProps, 'minimized' | 'toggle'>) {
    const icon = minimized ? faSearch : faChevronLeft;

    return (
        <div
            className="search-icon" role="button" aria-pressed={minimized}
            tabIndex={0} onClick={() => toggle()}
            aria-label="toggle search window"
        >
            <FontAwesomeIcon icon={icon} />
        </div>
    );
}

function InputView({
    className, placeholder, children,
    toggle, minimized, filtersHidden, toggleFilters, searchValue, setSearchValue
}: React.PropsWithChildren<{
    className: string;
    placeholder: string;
} & CommonViewProps>) {
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


export default function Inputs(commonViewProps: CommonViewProps) {
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
