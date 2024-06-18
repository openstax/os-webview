import React from 'react';
import fetchBooks from '~/models/books';
import {filterLiveBooks, SalesforceBook} from '~/helpers/books';
import {useNavigate, NavigateFunction, useLocation} from 'react-router-dom';

function afterFormSubmit(
    navigate: NavigateFunction,
    preselectedTitle: string,
    selectedBooks: SalesforceBook[]
) {
    fetchBooks.then((b) => {
        const liveBooks = b.filter(filterLiveBooks);
        const backTo = liveBooks.find(
            (entry) => entry.salesforce_abbreviation === preselectedTitle
        );

        /* Send to Tech Scout with books pre-selected */
        const scoutBooks = selectedBooks.map((sfBook) => sfBook.value);

        navigate('/partners', {
            state: {
                confirmation: true,
                book: scoutBooks,
                slug: backTo?.slug
            }
        });
    });
}

export function useFirstSearchArgument() {
    const {search} = useLocation();

    return decodeURIComponent(search.substring(1).replace(/&.*/, ''));
}

export function useAfterSubmit(selectedBooksRef: React.MutableRefObject<SalesforceBook[]>) {
    const navigate = useNavigate();
    const preselectedTitle = useFirstSearchArgument();

    return React.useCallback(
        () =>
            afterFormSubmit(
                navigate,
                preselectedTitle,
                selectedBooksRef.current
            ),
        [navigate, selectedBooksRef, preselectedTitle]
    );
}
