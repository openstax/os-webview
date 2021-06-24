import {useState, useEffect} from 'react';
import cmsFetch from '~/models/cmsFetch';
import uniqBy from 'lodash/uniqBy';

function isSalesforceBook(book) {
    return ['live', 'new_edition_available'].includes(book.book_state) &&
    book.salesforce_abbreviation;
}

async function loadData() {
    const {books} = await cmsFetch('books?format=json');
    const sfBooks = uniqBy(books.filter(isSalesforceBook), 'salesforce_abbreviation');

    return sfBooks
        .map((book) => ({
            label: book.salesforce_name,
            value: book.salesforce_abbreviation,
            coverUrl: book.cover_url,
            viewLink: book.webview_rex_link || book.webview_link,
            slug: book.slug,
            title: book.title
        }));
}

export default function useBooks() {
    const [data, setData] = useState([]);

    useEffect(() => loadData().then(setData), []);

    return data;
}
