import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import useMultiselectContext from '../multiselect-context';
import fetchBooks from '~/models/books';
import {
    salesforceTitles,
    subjects as getSubjects,
    SalesforceBook
} from '~/helpers/books';

function useSFBooks() {
    const [books, setBooks] = React.useState<SalesforceBook[]>([]);

    React.useEffect(() => {
        fetchBooks.then(salesforceTitles).then(setBooks);
    }, []);
    return books;
}

function useContextValue({
    selected: selectedValues = [],
    booksAllowed
}: {
    selected?: string[];
    booksAllowed?: string[];
}) {
    const allBooks = useSFBooks();
    const books = React.useMemo(
        () =>
            allBooks.filter(
                (b) => !booksAllowed || booksAllowed.includes(b.value)
            ),
        [allBooks, booksAllowed]
    );
    const subjects = React.useMemo(() => getSubjects(books).sort(), [books]);
    const {select, isSelected} = useMultiselectContext();
    const [filter, setFilter] = React.useState('');
    const matchingBooks = React.useMemo(
        () =>
            books.filter((b) =>
                b.text?.toLowerCase().includes(filter.toLowerCase())
            ),
        [books, filter]
    );
    const matchingSubjects = React.useMemo(
        () =>
            subjects.filter((s) =>
                s.toLowerCase().includes(filter.toLowerCase())
            ),
        [subjects, filter]
    );
    const filteredSubjects = React.useMemo(
        () =>
            subjects.filter(
                (s) =>
                    matchingSubjects.includes(s) ||
                    matchingBooks.find((b) => b.subjects.includes(s))
            ),
        [subjects, matchingSubjects, matchingBooks]
    );
    const filteredBooks = React.useMemo(
        () =>
            books.filter(
                (b) =>
                    matchingBooks.includes(b) ||
                    b.subjects.find((s) => matchingSubjects.includes(s))
            ),
        [books, matchingBooks, matchingSubjects]
    );

    React.useEffect(
        () =>
            books
                .filter(
                    (b) => !isSelected(b) && selectedValues.includes(b.value)
                )
                .forEach(select),
        [select, books, isSelected, selectedValues]
    );

    return {
        subjects: filteredSubjects,
        allBooks,
        books: filteredBooks,
        filter,
        setFilter
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as SFBookContextProvider};
