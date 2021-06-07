import React, {useState} from 'react';
import BlogContext from '../blog-context';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {faSearch} from '@fortawesome/free-solid-svg-icons/faSearch';
import './search-bar.scss';

function SearchBarInterior() {
    const {setPath} = React.useContext(BlogContext);
    const [searchString, setSearchString] = useState(decodeURIComponent(window.location.search.substr(1)));
    const clearHidden = searchString.length === 0;

    function onChange(event) {
        setSearchString(event.target.value);
    }
    function doSearch() {
        setPath(`/blog/?${searchString}`);
    }
    function searchOnEnter(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            doSearch();
        }
    }
    function clearSearch() {
        setSearchString('');
    }
    function clearByKey(event) {
        if (['Enter', ' '].includes(event.key)) {
            event.preventDefault();
            clearSearch();
        }
    }

    return (
        <React.Fragment>
            <div className="input-with-clear-button">
                <input
                    type="text" placeholder="Search" name="search-input"
                    value={searchString} onChange={onChange} onKeyPress={searchOnEnter}
                />
                <span
                    className="clear-search"
                    role="button" aria-label="clear search" tabIndex="0"
                    hidden={clearHidden} onClick={clearSearch} onKeyPress={clearByKey}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </span>
            </div>
            <button
                className="btn primary" type="button" onClick={doSearch}>
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </React.Fragment>
    );
}

export default function SearchBar() {
    return (
        <div className="search-bar">
            <SearchBarInterior />
        </div>
    );
}
