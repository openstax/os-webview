import React from 'react';
import * as Sentry from '@sentry/react';
import fetchBooks from '~/models/books';
import {captureException} from '~/helpers/posthog-exceptions';
import {filterLiveBooks, SalesforceBook} from '~/helpers/books';
import {useNavigate, NavigateFunction, useLocation} from 'react-router-dom';
import {captureEvent} from '~/helpers/posthog';
import usePortalContext from '~/contexts/portal';

// The book list only supplies the "back to" slug, so a failed lookup
// must not keep the user on the form they just submitted.
async function backToSlug(preselectedTitle: string) {
    // Nothing to look up, so don't wait for (or start) the request
    if (!preselectedTitle) {
        return undefined;
    }
    try {
        const books = await fetchBooks();

        return books.filter(filterLiveBooks).find(
            (entry) => entry.salesforce_abbreviation === preselectedTitle
        )?.slug;
    } catch (error) {
        Sentry.captureException(error);
        captureException(error);
        return undefined;
    }
}

function afterFormSubmit(
    navigate: NavigateFunction,
    linkPrefix: string,
    preselectedTitle: string,
    selectedBooks: SalesforceBook[]
) {
    backToSlug(preselectedTitle).then((slug) => {
        /* Send to Tech Scout with books pre-selected -- Language removed */
        const scoutBooks = selectedBooks.map((sfBook) => sfBook.value.replace(/ *\[.*/, ''));

        captureEvent('interest_form_submitted', {bookCount: selectedBooks.length});
        navigate(`${linkPrefix}/partners`, {
            state: {
                confirmation: true,
                book: scoutBooks,
                slug
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
    const {linkPrefix} = usePortalContext();
    const preselectedTitle = useFirstSearchArgument();

    return React.useCallback(
        () =>
            afterFormSubmit(
                navigate,
                linkPrefix,
                preselectedTitle,
                selectedBooksRef.current
            ),
        [navigate, linkPrefix, selectedBooksRef, preselectedTitle]
    );
}
