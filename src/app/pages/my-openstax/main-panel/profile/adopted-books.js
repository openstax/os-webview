import React, { useState } from 'react';
import { PlusBox, PutAway } from '../common';
import Multiselect from './multiselect/multiselect';
import { useStoreon } from 'storeon/preact';

function Book({ name }) {
    return (
        <div className='adopted-book card'>
            <div className='cover'>{name}</div>
            <PutAway />
            <a className='btn primary' href='/book'>View book</a>
            <a className='btn' href='/resources'>See resources</a>
        </div>
    );
}

function AddBook() {
    const { dispatch, books } = useStoreon('books');
    const [showSelector, updateShowSelector] = useState(false);
    const bookToOption = (b) => ({
        label: b.title,
        value: b
    });
    const selectedOptions = books.filter((book) => book.selected).map(bookToOption);
    const unselectedOptions = books.filter((book) => !book.selected).map(bookToOption);
    const getLabel = (b) => b.title;

    function toggleSelector() {
        updateShowSelector(!showSelector);
    }
    function onSelect(item) {
        dispatch('books/add', item);
    }
    function onRemove(item) {
        dispatch('books/remove', item);
    }

    return (
        <React.Fragment>
            <div className='add-book' role='button' onClick={toggleSelector}>
                <PlusBox />
                <span>Add a book</span>
            </div>
            {
                showSelector &&
                <Multiselect
                    putAway={toggleSelector} title='Add books'
                    prompt='Book title' options={unselectedOptions}
                    selectedOptions={selectedOptions}
                    getLabel={getLabel}
                    onSelect={onSelect}
                    onRemove={onRemove}
                />
            }
        </React.Fragment>
    );
}

export default function AdoptedBooks() {
    const { books } = useStoreon('books');

    return (
        <section>
            <h3>Adopted books</h3>
            <div className='flexrow'>
                {
                    books.filter((book) => book.selected).map((book) =>
                        <Book name={book.title} key={book.title} />
                    )
                }
                <AddBook />
            </div>
        </section>
    );
}
