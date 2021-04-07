import React from 'react';
import Quote from '~/components/quote/quote.jsx';
import './quotes.scss';

export default function ({quotes}) {
    const boxClass = `boxes-${quotes.length}`;

    return (
        <div className={`quotes ${boxClass}`}>
            {quotes.map((quote) => <Quote model={quote} key={quote.content} />)}
        </div>
    );
}
