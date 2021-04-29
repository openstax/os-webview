import React from 'react';
import { useStoreon } from 'storeon/preact';
import { Singleselect } from '~/pages/my-openstax/multiselect/multiselect';
import { AddButton } from '../../common';

function AdoptionUpdater({ selection, disabled, onChange, onRemove }) {
    const { books: bookOptions } = useStoreon('books');
    const selectedOption = bookOptions.find((opt) => opt.value === (selection.title || {}).value);

    function onChangeTitle(newTitle) {
        selection.title = newTitle;
    }

    function onChangeStudents(event) {
        const newStudents = event.target.value;

        selection.numStudents = newStudents;
        onChange();
    }

    return (
        <div className='adoption-updater book-selector-columns'>
            <Singleselect
                initialValue={selectedOption} options={bookOptions}
                disabled={disabled} autoFocus={!disabled}
                onChange={onChangeTitle}
            />
            <input
                value={selection.numStudents} type='number' min='1'
                onChange={onChangeStudents}
            />
            <button type='button' className='remover custom' onClick={() => onRemove(selection)}>
                ×
            </button>
        </div>
    );
}

export default function BookSelector({ initialSelections, selectedBooks, setSelectedBooks }) {
    function isInitialSelection(s) {
        return s.title && initialSelections.some((i) => i.title.value === s.title.value);
    }

    function addSelection() {
        setSelectedBooks([...selectedBooks, {}]);
    }

    function onChange() {
        setSelectedBooks([...selectedBooks]);
    }

    function onRemove(selection) {
        setSelectedBooks(selectedBooks.filter((s) => s !== selection));
    }

    return (
        <div className='adopted-books'>
            <div className='book-selector-columns'>
                <div className='field-label'>Adopted books</div>
                <div className='field-label'>Number of students</div>
            </div>
            <div className='book-selector-rows'>
                {
                    selectedBooks
                        .map((s) =>
                            <AdoptionUpdater
                                key={s} selection={s} disabled={isInitialSelection(s)}
                                onChange={onChange} onRemove={onRemove}
                            />
                        )
                }
            </div>
            <AddButton label='Add a textbook' onClick={addSelection} />
        </div>
    );
}
