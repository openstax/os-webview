import cmsFetch from '~/helpers/cms-fetch';
import {type Book} from '~/helpers/books';

type BookContainer = {
    books: Book[];
};

const fetchBooks = cmsFetch('books?format=json').then((r: BookContainer) =>
    r.books.filter((b) => b.book_state !== 'retired')
);

export default fetchBooks;

const bookFields = [
    'book_state',
    'book_subjects',
    'cover_url',
    'salesforce_abbreviation',
    'salesforce_name',
    'title',
    'slug',
    'content_warning_text'
].join(',');

type RawBook = Omit<Book, 'subjects'> & {book_subjects: {subject_name: string}[];};

function rawToBook(b: RawBook) {
    return {
        ...b,
        subjects: b.book_subjects.map((sObj) => sObj.subject_name)
    };
}

export const fetchAllBooks = cmsFetch(`pages/?type=books.Book&fields=${bookFields}&limit=250`)
.then((r: {items: RawBook[]}) => {
    return r.items.map(rawToBook);
});
