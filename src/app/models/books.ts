import cmsFetch from '~/helpers/cms-fetch';
import {type Book} from '~/helpers/books';

type BookContainer = {
    books: Book[];
};

const fetchBooks = cmsFetch('books?format=json').then((r: BookContainer) =>
    r.books.filter((b) => b.book_state !== 'retired')
);

export default fetchBooks;
