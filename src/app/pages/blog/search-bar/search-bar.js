import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './search-bar.css';
import WrappedJsx from '~/controllers/jsx-wrapper';
import {Bus} from '~/helpers/controller/bus-mixin';

function SearchBarInterior({setPath}) {
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
                    role="button" aria-label="clear search" tabindex="0"
                    hidden={clearHidden} onClick={clearSearch} onKeyPress={clearByKey}
                >
                    <FontAwesomeIcon icon="times" />
                </span>
            </div>
            <button
                className="btn primary" type="button" onClick={doSearch}>
                <FontAwesomeIcon icon="search" />
            </button>
        </React.Fragment>
    );
}

export default function SearchBar(props) {
    return (
        <div className="search-bar">
            <SearchBarInterior {...props} />
        </div>
    );
}
