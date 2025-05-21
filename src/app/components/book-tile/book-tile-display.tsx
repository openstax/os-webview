import React from 'react';
import PromoteBadge from '~/components/promote-badge/promote-badge';
import type {Item} from '~/models/book-titles';
import {Book as BookInfo} from '~/pages/subjects/new/specific/context';
import GetTheBookDropdown from './dropdown-menu';
import cn from 'classnames';
import './book-tile.scss';

type AdditionalFields = Partial<{
    promoteSnippet: Item['promote_snippet'];
    bookState: string;
}>

export default function BookTile({book}: {book: BookInfo & AdditionalFields}) {
    const {coverUrl, title, slug} = book;
    const comingSoon = book.bookState === 'coming_soon';
    const snippets = book.promoteSnippet?.filter((s) => s.value.image);
    const promoteSnippet = snippets?.find((s) => s.value.image);
    const classes = cn({
        'book-tile': true,
        'coming-soon': comingSoon,
        promote: Boolean(promoteSnippet)
    });

    return (
        <div className={classes}>
            <a href={`/details/${slug}`} aria-label={`${title} book`}>
                <img
                    src={coverUrl}
                    role='presentation'
                    width='240'
                    height='240'
                />
                {promoteSnippet?.value.image && (
                    <PromoteBadge
                        name={promoteSnippet.value.name}
                        image={promoteSnippet.value.image}
                    />
                )}
                <div className='text-block'>
                    {title}
                </div>
            </a>
            {comingSoon ? (
                <div className='navmenu'>
                    <button type='button' disabled>
                        Coming soon
                    </button>
                </div>
            ) : (
                <GetTheBookDropdown bookInfo={book} />
            )}
        </div>
    );
}
