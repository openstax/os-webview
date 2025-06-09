import React from 'react';
import cn from 'classnames';
import './BookListBlock.scss';
import BookTile from '~/components/book-tile/book-tile-display';
import type {Book} from '~/pages/subjects/new/specific/context';

/*
 * the book data formatting in the CMS is currently fragemented,
 * when it gets centralized we can centralize the types as well
 */
export type BookInfo = Book & {
    bookState: string;
    promoteSnippet: {
        value: {
            id: number;
            description: string;
            image: string;
            name: string;
        };
    }[];
};

export type BookListBlockConfig = {
    id: string;
    type: 'book_list';
    value: {
        books: BookInfo[];
    };
};

export function BookListBlock({data}: {data: BookListBlockConfig}) {
    return (
        <div className={cn('content-block-book-list')}>
            {data.value.books.map((book) => <BookTile key={book.id} book={book} />)}
        </div>
    );
}
