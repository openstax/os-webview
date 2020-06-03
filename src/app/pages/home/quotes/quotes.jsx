import React from 'react';
import Quote from '~/components/quote/quote.jsx';
import './quotes.css';

export default function ({quotes}) {
    const boxClass = `boxes-${quotes.length}`;

    return (
        <div className={`quotes ${boxClass}`}>
            {
                quotes.map((quote) => <Quote model={quote} />)
            }
        </div>
    );
}
