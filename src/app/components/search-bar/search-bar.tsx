import React from 'react';
import useSearchContext, {
    SearchContextProvider,
    SearchFunction
} from './search-context';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {faSearch} from '@fortawesome/free-solid-svg-icons/faSearch';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import './search-bar.scss';

type SearchBarParams = {
    searchFor: SearchFunction;
    amongWhat: string;
};

export function HeadingAndSearchBar({
    searchFor,
    amongWhat,
    children
}: React.PropsWithChildren<SearchBarParams>) {
    return (
        <div className="heading-and-searchbar">
            {children}
            <SearchBar searchFor={searchFor} amongWhat={amongWhat} />
        </div>
    );
}

export default function SearchBar({searchFor, amongWhat}: SearchBarParams) {
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

function SearchInput({amongWhat}: Pick<SearchBarParams, 'amongWhat'>) {
    const {searchString, setSearchString, doSearch} = useSearchContext();
    const onChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchString(event.target.value);
        },
        [setSearchString]
    );
    const searchOnEnter = React.useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                doSearch();
            }
        },
        [doSearch]
    );

    return (
        <input
            type="text"
            placeholder={`Search all ${amongWhat}`}
            name="search-input"
            value={searchString}
            onChange={onChange}
            onKeyDown={searchOnEnter}
        />
    );
}

function ClearButton() {
    const {searchString, setSearchString} = useSearchContext();
    const clearSearch = React.useCallback(
        () => setSearchString(''),
        [setSearchString]
    );
    const clearHidden = searchString.length === 0;

    return (
        <span
            className="clear-search"
            role="button"
            aria-label="clear search"
            tabIndex={0}
            hidden={clearHidden}
            onClick={clearSearch}
            onKeyDown={treatSpaceOrEnterAsClick}
        >
            <FontAwesomeIcon icon={faTimes} />
        </span>
    );
}

function SearchButton() {
    const {doSearch} = useSearchContext();

    return (
        <button
            className="btn primary"
            type="button"
            onClick={doSearch}
            aria-label="search"
        >
            <FontAwesomeIcon icon={faSearch} />
        </button>
    );
}
