import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import useMultiselectContext from '../multiselect-context.js';
import fetchBooks, {salesforceTitles, subjects as getSubjects} from '~/models/books';

function useSFBooks() {
    const [books, setBooks] = React.useState([]);

    React.useEffect(() => fetchBooks.then(salesforceTitles).then(setBooks), []);
    return books;
}

function useContextValue(selectedValues) {
    const books = useSFBooks();
    const subjects = React.useMemo(() => getSubjects(books).sort(), [books]);
    const {select, isSelected} = useMultiselectContext();

    React.useEffect(
        () => books
            .filter((b) => !isSelected(b) && selectedValues.includes(b.value))
            .forEach(select),
        [select, books, isSelected, selectedValues]
    );

    return {
        subjects,
        books
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SFBookContextProvider
};
