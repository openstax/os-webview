import React, {useState, useContext} from 'react';
import useBlogContext from '../blog-context';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {faSearch} from '@fortawesome/free-solid-svg-icons/faSearch';
import './search-bar.scss';

const SearchContext = React.createContext();

function useSearchContextValue() {
    const {setPath} = useBlogContext();
    const [searchString, setSearchString] = useState(decodeURIComponent(window.location.search.substr(1)));

    function doSearch() {
        setPath(`/blog/?${searchString}`);
    }

    return {searchString, setSearchString, doSearch};
}

function SearchInput() {
    const {searchString, setSearchString, doSearch} = useContext(SearchContext);

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
            type="text" placeholder="Search" name="search-input"
            value={searchString} onChange={onChange} onKeyPress={searchOnEnter}
        />
    );
}

function ClearButton() {
    const {searchString, setSearchString} = useContext(SearchContext);

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
    const {doSearch} = useContext(SearchContext);

    return (
        <button
            className="btn primary" type="button" onClick={doSearch}>
            <FontAwesomeIcon icon={faSearch} />
        </button>
    );
}

export default function SearchBar() {
    const contextValue = useSearchContextValue();

    return (
        <SearchContext.Provider value={contextValue}>
            <div className="search-bar">
                <div className="input-with-clear-button">
                    <SearchInput />
                    <ClearButton />
                </div>
                <SearchButton />
            </div>
        </SearchContext.Provider>
    );
}
