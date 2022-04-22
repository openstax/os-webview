import React from 'react';
import useSearchContext, {SearchContextProvider} from './search-context';
import useBlogContext from '../blog-context';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {faSearch} from '@fortawesome/free-solid-svg-icons/faSearch';
import './search-bar.scss';

function SearchInput() {
    const {searchString, setSearchString, doSearch} = useSearchContext();

    function onChange(event) {
        setSearchString(event.target.value);
    }
    function searchOnEnter(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            doSearch();
        }
    }

    return (
        <input
            type="text" placeholder="Search all blog posts" name="search-input"
            value={searchString} onChange={onChange} onKeyPress={searchOnEnter}
        />
    );
}

function ClearButton() {
    const {searchString, setSearchString} = useSearchContext();

    function clearSearch() {
        setSearchString('');
    }
    function clearByKey(event) {
        if (['Enter', ' '].includes(event.key)) {
            event.preventDefault();
            clearSearch();
        }
    }
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

export default function SearchBar() {
    return (
        <SearchContextProvider>
            <div className="search-bar">
                <div className="input-with-clear-button">
                    <SearchInput />
                    <ClearButton />
                </div>
                <SearchButton />
            </div>
        </SearchContextProvider>
    );
}

export function HeadingAndSearchBar({children}) {
    const {setPath} = useBlogContext();

    return (
        <div className="heading-and-searchbar">
            {children}
            <SearchBar setPath={setPath} />
        </div>
    );
}
