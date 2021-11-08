import React, {useState} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import fetchBooks from '~/models/books';
import {useLocation} from 'react-router-dom';
import {useDataFromPromise, useDataFromSlug} from '~/components/jsx-helpers/jsx-helpers.jsx';

function useSearchParams() {
    const {search} = useLocation();

    return React.useMemo(() => new window.URLSearchParams(search), [search]);
}

function useContextValue() {
    const searchParams = useSearchParams();
    const initialTitle = React.useMemo(() => searchParams.get('book'), [searchParams]);
    const [title, setTitle] = useState(initialTitle);
    const books = useDataFromPromise(fetchBooks);
    const selectedBook = React.useMemo(
        () => books?.find((b) => b.title === title) || {},
        [books, title]
    );
    const bookInfo = useDataFromSlug(selectedBook.slug) || selectedBook;
    const [hasError, setHasError] = useState('You have not completed the form');
    const [hideErrors, setHideErrors] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const validateBeforeSubmitting = React.useCallback(
        (event) => {
            event.preventDefault();
            setHideErrors(false);
            if (!hasError) {
                setSubmitting(true);
            }
        },
        [setHideErrors, hasError, setSubmitting]
    );

    return {
        selectedBook: bookInfo,
        isTutor: Boolean(bookInfo?.tutor_marketing_book),
        books,
        hasError, setHasError,
        hideErrors,
        submitting,
        validateBeforeSubmitting,
        searchParams,
        title,
        setTitle
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as ErrataFormContextProvider
};
