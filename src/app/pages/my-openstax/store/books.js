import cmsFetch from '~/models/cmsFetch';

function isSalesforceBook(book) {
    return ['live', 'new_edition_available'].includes(book.book_state) &&
    book.salesforce_abbreviation;
}

async function loadData() {
    const pageData = await cmsFetch('books?format=json');
    const seen = {};

    return pageData.books.filter(isSalesforceBook)
        .filter((book) => {
            if (seen[book.salesforce_abbreviation]) {
                return false;
            }
            seen[book.salesforce_abbreviation] = true;
            return true;
        })
        .map((book) => ({
            label: book.salesforce_name,
            value: book.salesforce_abbreviation,
            coverUrl: book.cover_url
        }));
}

export default function (store) {
    const INITIAL_STATE = {
        books: []
    };

    store.on('@init', () => {
        loadData().then((data) => store.dispatch('books/loaded', data));
        return INITIAL_STATE;
    });
    store.on('books/loaded', (_, data) => {
        return {
            books: data
        };
    });
}
