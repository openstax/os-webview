import React, {useState, useEffect} from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import cmsFetch from '~/models/cmsFetch';
import bookPromise from '~/models/book-titles';

const instructions = 'Errata submissions are displayed below until a new PDF is published online.';
const moreAbout = 'More about our correction schedule';
const correctionScheduleKeyFromBookState = {
    'live': 'correction_schedule',
    'deprecated': 'deprecated_errata_message',
    'new_edition_available': 'new_edition_errata_message'
};

function useBookInfo(book) {
    const [info, setInfo] = useState([]);

    useEffect(() => {
        bookPromise.then((bookList) => {
            const entry = bookList.find(({title}) => title === book);

            if (entry) {
                const slug = `books/${entry.meta.slug}`;
                const title = entry.title;

                setInfo([slug, title]);
            } else {
                routerBus.emit('navigate', '/_404', window.location.href);
            }
        });
    }, []);

    return info;
}

function useErrataHoverHtml(slug) {
    const [html, setHtml] = useState('<p>...loading...</p>');

    useEffect(() => {
        async function fetchData() {
            if (!slug) {
                return;
            }
            const [bookData, errataPageData] = await Promise.all([cmsFetch(slug), cmsFetch('pages/errata')]);
            const k = correctionScheduleKeyFromBookState[bookData.book_state];
            const errataMessage = errataPageData[k] || `Book in unknown state: ${bookData.book_state}`;

            setHtml(errataMessage);
        }
        fetchData();
    }, [slug]);

    return html;
}

export default function Hero({book}) {
    const [slug, title] = useBookInfo(book);
    const errataHoverHtml = useErrataHoverHtml(slug);

    if (!slug) {
        return null;
    }
    return (
        <div className="hero">
            <div className="text-area">
                <h1>{title} Errata</h1>
                <div>
                    <div className="instructions">{instructions}</div>
                    <div className="with-tooltip">
                        {moreAbout}
                        <RawHTML className="tooltip" html={errataHoverHtml} />
                    </div>
                </div>
            </div>
        </div>
    );
}
