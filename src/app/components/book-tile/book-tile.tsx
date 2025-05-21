import React from 'react';
import bookPromise, {Item} from '~/models/book-titles';
import {Book as BookInfo} from '~/pages/subjects/new/specific/context';
import './book-tile.scss';
import BookTileDisplay from './book-tile-display';

export default function BookTile({book: [book]}: {book: [BookInfo]}) {
    const info = useBookInfo(book.id);

    return <BookTileDisplay
        book={{
            ...book,
            bookState: info?.book_state,
            promoteSnippet: info?.promote_snippet
        }}
    />;
}

function useBookInfo(id: number) {
    const [state, setState] = React.useState<Item | undefined>();

    React.useEffect(() => {
        bookPromise.then((items) => setState(items.find((i) => i.id === id)));
    }, [id]);

    return state;
}
