import React from 'react';
import useSpecificSubjectContext, {CategoryData} from './context';
import BookTile from '~/components/book-tile/book-tile';
import {ActiveElementContextProvider} from '~/contexts/active-element';
import {useLocation} from 'react-router-dom';
import throttle from 'lodash/throttle';
import './book-viewer.scss';

function Category({
    category: [heading, categoryData]
}: {
    category: [string, CategoryData];
}) {
    const booksObj = categoryData.books;
    const books = Object.values(booksObj);
    const text = categoryData.categoryDescription;
    const {hash} = useLocation();
    const ref = React.useRef(null);

    // Image loads screw up the scroll-to location, so we listen for them
    // and re-scroll when images complete loading
    // throttled to reduce possible jitter
    React.useEffect(() => {
        const isInitialScrollTarget =
            window.decodeURIComponent(hash.substring(1)) === heading;

        if (!isInitialScrollTarget) {
            return undefined;
        }
        const throttleGoTo = throttle((el) => {
            el.scrollIntoView({block: 'center', behavior: 'smooth'});
        }, 500);
        const initialScroll = () => {
            throttleGoTo(ref.current);
        };

        document.body.addEventListener('load', initialScroll, true);
        initialScroll();
        return () =>
            document.body.removeEventListener('load', initialScroll, true);
    }, [heading, hash]);

    return (
        <div id={heading} className="category" ref={ref}>
            <h2>{heading}</h2>
            <div>{text}</div>
            <div className="books">
                {books.map((b) => (
                    <BookTile key={b[0].id} book={b} />
                ))}
            </div>
        </div>
    );
}

export default function BookViewer() {
    const {categories} = useSpecificSubjectContext();

    return (
        <ActiveElementContextProvider>
            <section className="book-viewer">
                <div className="content">
                    {categories.map((c) => (
                        <Category key={c[0]} category={c} />
                    ))}
                </div>
            </section>
        </ActiveElementContextProvider>
    );
}
