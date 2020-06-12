import React, {useState, useEffect} from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import cmsFetch from '~/models/cmsFetch';

const instructions = 'Errata submissions are displayed below until a new PDF is published online.';
const moreAbout = 'More about our correction schedule';
const correctionScheduleKeyFromBookState = {
    'live': 'correction_schedule',
    'deprecated': 'deprecated_errata_message',
    'new_edition_available': 'new_edition_errata_message'
};

export default function Hero({slug, title}) {
    const [errataHoverHtml, updateErrataHoverHtml] = useState('<p>...loading...</p>');

    useEffect(async () => {
        const [bookData, errataPageData] = await Promise.all([cmsFetch(slug), cmsFetch('pages/errata')]);
        const k = correctionScheduleKeyFromBookState[bookData.book_state];
        const errataMessage = errataPageData[k] || `Book in unknown state: ${bookData.book_state}`;

        updateErrataHoverHtml(errataMessage);
    }, [slug]);

    return (
        <div className="hero">
            <div className="text-area">
                <h1>{title} Errata</h1>
                <div>
                    <div className="instructions">{instructions}</div>
                    <div className="with-tooltip">
                        {moreAbout}
                        <RawHTML className="tooltip" html={errataHoverHtml}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
