import React from 'react';
import booksPromise from '~/models/books';
import {
    salesforceTitles as getTitles,
    subjects as getSubjects
} from '~/helpers/books';
import {useDataFromPromise} from '~/helpers/page-data-utils';
import Checkboxes from '../checkboxes-linked-to-store/checkboxes-linked-to-store';
import type {Store} from '~/pages/partners/search-context';
import './book-options.scss';

export default function BookOptions({store}: {store: Store}) {
    const books = useDataFromPromise(booksPromise);

    if (!books) {
        return null;
    }
    const salesforceTitles = getTitles(books);
    const subjects = getSubjects(salesforceTitles);

    function optionsForSubject(subject: string) {
        return salesforceTitles
            .filter((b) => b.subjects.includes(subject))
            .map(({text, value}) => ({
                label: text,
                value
            }));
    }

    return (
        <div className="book-options">
            {subjects.map((subject) => (
                <div className="subject" key={subject}>
                    <h2>{subject}</h2>
                    <Checkboxes
                        store={store}
                        options={optionsForSubject(subject)}
                    />
                </div>
            ))}
        </div>
    );
}
