import React from 'react';
import useSearchContext, {SearchContextProvider} from './search-context';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {faSearch} from '@fortawesome/free-solid-svg-icons/faSearch';
import './search-bar.scss';

function SearchInput({amongWhat}) {
    const {searchString, setSearchString, doSearch} = useSearchContext();
    const onChange = React.useCallback(
        (event) => {
            setSearchString(event.target.value);
        },
        [setSearchString]
    );
    const searchOnEnter = React.useCallback(
        (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                doSearch();
            }
        },
        [doSearch]
    );

    return (
        <input
            type="text" placeholder={`Search all ${amongWhat}`} name="search-input"
            value={searchString} onChange={onChange} onKeyPress={searchOnEnter}
        />
    );
}

function ClearButton() {
    const {searchString, setSearchString} = useSearchContext();
    const clearSearch = React.useCallback(
        () => setSearchString(''),
        [setSearchString]
    );
    const clearByKey = React.useCallback(
        (event) => {
            if (['Enter', ' '].includes(event.key)) {
                event.preventDefault();
                clearSearch();
            }
        },
        [clearSearch]
    );
    const clearHidden = searchString.length === 0;

    return (
        <span
            className="clear-search"
            role="button" aria-label="clear search" tabIndex="0"
            hidden={clearHidden} onClick={clearSearch} onKeyPress={clearByKey}
        >
            <FontAwesomeIcon icon={faTimes} />
        </span>
    );
}

function SearchButton() {
    const {doSearch} = useSearchContext();

    return (
        <button
            className="btn primary" type="button" onClick={doSearch}
            aria-label="search"
        >
            <FontAwesomeIcon icon={faSearch} />
        </button>
    );
}

export default function SearchBar({searchFor, amongWhat}) {
    return (
        <SearchContextProvider contextValueParameters={{searchFor}}>
            <div className="search-bar">
                <div className="input-with-clear-button">
                    <SearchInput amongWhat={amongWhat} />
                    <ClearButton />
                </div>
                <SearchButton />
            </div>
        </SearchContextProvider>
    );
}

export function HeadingAndSearchBar({searchFor, amongWhat, children}) {
    return (
        <div className="heading-and-searchbar">
            {children}
            <SearchBar searchFor={searchFor} amongWhat={amongWhat} />
        </div>
    );
}
