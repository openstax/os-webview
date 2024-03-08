import React from 'react';
import useSearchContext, {
    SearchContextProvider,
    SearchFunction
} from './search-context';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {faSearch} from '@fortawesome/free-solid-svg-icons/faSearch';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import cn from 'classnames';
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
                <SearchInput amongWhat={amongWhat} />
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
    const inputId = `search-${amongWhat}`;

    return (
        <PlaceholderLabel forId={inputId} text={`Search all ${amongWhat}`}>
            <div className="input-with-clear-button">
                <input
                    id={inputId}
                    type="text"
                    placeholder=""
                    name="search-input"
                    value={searchString}
                    onChange={onChange}
                    onKeyDown={searchOnEnter}
                />
                <ClearButton />
            </div>
        </PlaceholderLabel>
    );
}

type PlaceholderLabelProps = {
    forId: string;
    text: string;
};

function PlaceholderLabel({
    forId,
    children,
    text
}: React.PropsWithChildren<PlaceholderLabelProps>) {
    const {searchString} = useSearchContext();
    const empty = searchString === '';

    return (
        <label className={cn('placeholder-label', {empty})} htmlFor={forId}>
            {children}
            <div className="floating-label">{text}</div>
        </label>
    );
}

function ClearButton() {
    const {setSearchString} = useSearchContext();
    const clearSearch = React.useCallback(
        () => setSearchString(''),
        [setSearchString]
    );

    return (
        <span
            className="clear-search"
            role="button"
            aria-label="clear search"
            tabIndex={0}
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
