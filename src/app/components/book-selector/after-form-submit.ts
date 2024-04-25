import fetchBooks from '~/models/books';
import {filterLiveBooks, SalesforceBook} from '~/helpers/books';
import type {NavigateFunction} from 'react-router-dom';

export default function afterFormSubmit(
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
