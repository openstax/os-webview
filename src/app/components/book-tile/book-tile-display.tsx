import React from 'react';
import {useLocation} from 'react-router-dom';
import PromoteBadge from '~/components/promote-badge/promote-badge';
import type {Item} from '~/models/book-titles';
import {Book as BookInfo} from '~/pages/subjects/new/specific/context';
import GetTheBookDropdown from './dropdown-menu';
import cn from 'classnames';
import usePortalContext from '~/contexts/portal';
import {assertNotNull} from '~/helpers/data';
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
    const ref = React.useRef<HTMLDivElement>(null);
    const {portalPrefix, rewriteLinks} = usePortalContext();
    const {pathname} = useLocation();
    const classes = cn({
        'book-tile': true,
        'coming-soon': comingSoon,
        promote: Boolean(promoteSnippet)
    });

    /* For a top-level Flex (portal) page, links are rewritten elsewhere
     * Tiles in sub-pages need to rewrite their links
     */
    React.useLayoutEffect(() => {
        const normalizedPathname = pathname.replace(/\/$/, '');

        if (portalPrefix !== normalizedPathname) {
            rewriteLinks(assertNotNull<HTMLElement>(ref.current));
        }
    }, [pathname, portalPrefix, rewriteLinks]);

    return (
        <div className={classes} ref={ref}>
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
