import React from 'react';
import fetchBooks from '~/models/books';
import {filterLiveBooks, SalesforceBook} from '~/helpers/books';
import {useNavigate, NavigateFunction, useLocation} from 'react-router-dom';
import usePortalContext from '~/contexts/portal';

function afterFormSubmit(
    navigate: NavigateFunction,
    portalPrefix: string,
    preselectedTitle: string,
    selectedBooks: SalesforceBook[]
) {
    fetchBooks.then((b) => {
        const liveBooks = b.filter(filterLiveBooks);
        const backTo = liveBooks.find(
            (entry) => entry.salesforce_abbreviation === preselectedTitle
        );

        /* Send to Tech Scout with books pre-selected -- Language removed */
        const scoutBooks = selectedBooks.map((sfBook) => sfBook.value.replace(/ *\[.*/, ''));

        navigate(`${portalPrefix}/partners`, {
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
    const {portalPrefix} = usePortalContext();
    const preselectedTitle = useFirstSearchArgument();

    return React.useCallback(
        () =>
            afterFormSubmit(
                navigate,
                portalPrefix,
                preselectedTitle,
                selectedBooksRef.current
            ),
        [navigate, portalPrefix, selectedBooksRef, preselectedTitle]
    );
}
