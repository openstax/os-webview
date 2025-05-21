import React from 'react';
import cn from 'classnames';
import './BookListBlock.scss';
import BookTile from '~/components/book-tile/book-tile-display';

/*
 * the book data formatting in the CMS is currently fragemented,
 * when it gets centralized we can centralize the types as well
 */
export type BookInfo = {
    id: number;
    slug: string;
    title: string;
    webviewRexLink: string;
    webviewLink: string;
    highResolutionPdfUrl: string;
    lowResolutionPdfUrl: string;
    coverUrl: string;
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
