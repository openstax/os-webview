import React, {useState} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import fetchBooks from '~/models/books';
import {type Book} from '~/helpers/books';
import {useLocation} from 'react-router-dom';
import {useDataFromPromise, useDataFromSlug} from '~/helpers/page-data-utils';

type ContextValue = {
    selectedBook: Book | null;
    books: Book[] | null | undefined;
    hasError: string | null;
    setHasError: (error: string | null) => void;
    hideErrors: boolean;
    submitting: boolean;
    validateBeforeSubmitting: (event: React.FormEvent) => void;
    searchParams: URLSearchParams;
    title: string | null;
    setTitle: (title: string) => void;
};

function useSearchParams() {
    const {search} = useLocation();

    return React.useMemo(() => new window.URLSearchParams(search), [search]);
}

function useContextValue(): ContextValue {
    const searchParams = useSearchParams();
    const initialTitle = React.useMemo(
        () => searchParams.get('book'),
        [searchParams]
    );
    const [title, setTitle] = useState<string | null>(initialTitle);
    const books = useDataFromPromise(fetchBooks);
    const selectedBook = React.useMemo(
        () => books?.find((b) => b.title === title) || null,
        [books, title]
    );
    const bookInfo =
        useDataFromSlug<Book>(selectedBook ? selectedBook.slug : null) ||
        selectedBook;
    const [hasError, setHasError] = useState<string | null>(
        'You have not completed the form'
    );
    const [hideErrors, setHideErrors] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const validateBeforeSubmitting = React.useCallback(
        (event: React.FormEvent) => {
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
        books,
        hasError,
        setHasError,
        hideErrors,
        submitting,
        validateBeforeSubmitting,
        searchParams,
        title,
        setTitle
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as ErrataFormContextProvider};
