import React from 'react';
import AssignableBadge from '~/components/assignable-badge/assignable-badge';
import bookPromise, {Item} from '~/models/book-titles';
import {Book as BookInfo} from '~/pages/subjects/new/specific/context';
import GetTheBookDropdown from './dropdown-menu';
import cn from 'classnames';
import './book-tile.scss';

export default function BookTile({
    book: [book]
}: {
    book: [book: BookInfo];
}) {
    const {coverUrl, title, slug} = book;
    const info = useBookInfo(book.id);
    const comingSoon = info?.book_state === 'coming_soon';
    const assignable = info?.assignable_book === true;
    const classes = cn({
        'book-tile': true,
        'coming-soon': comingSoon,
        assignable
    });

    return (
        <div className={classes}>
            <a href={`/details/${slug}`}>
                <img
                    src={coverUrl}
                    role='presentation'
                    width='240'
                    height='240'
                />
                {assignable && <AssignableBadge />}
            </a>
            <div className='text-block'>
                <a href={`/details/${slug}`}>{title}</a>
            </div>
            {
                comingSoon ?
                    <div className='navmenu'>
                        <button type='button' disabled>Coming soon</button>
                    </div> :
                    <GetTheBookDropdown bookInfo={book} />
            }
        </div>
    );
}

function useBookInfo(id: number) {
    const [state, setState] = React.useState<Item | undefined>();

    React.useEffect(
        () => {
            bookPromise.then((items) =>
                setState(items.find((i) => i.id === id))
            );
        },
        [id]
    );

    return state;
}
