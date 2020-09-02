import React from 'react';
import booksPromise, {salesforceTitles as getTitles, subjects as getSubjects} from '~/models/books';
import {useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Checkboxes from '../checkboxes-linked-to-store/checkboxes-linked-to-store';
import './book-options.css';

export default function BookOptions({store}) {
    const books = useDataFromPromise(booksPromise);

    if (!books) {
        return null;
    }
    const salesforceTitles = getTitles(books);
    const subjects = getSubjects(salesforceTitles);

    function optionsForSubject(subject) {
        return salesforceTitles
            .filter((b) => b.subjects.includes(subject))
            .map(({text, value}) => ({
                label: text,
                value
            }));
    }

    return (
        <div className="book-options">
            {
                subjects.map((subject) =>
                    <div className="subject" key={subject}>
                        <h2>{subject}</h2>
                        <Checkboxes store={store} options={optionsForSubject(subject)} />
                    </div>
                )
            }
        </div>
    );
}
