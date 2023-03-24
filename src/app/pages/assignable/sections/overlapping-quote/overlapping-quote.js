import React from 'react';
import './overlapping-quote.scss';

export default function OverlappingQuote({
    data: {
        quote, quoteAuthor: name, quoteTitle: title, quoteSchool: school
    }
}) {
    if (!quote) {
        return null;
    }

    return (
        <section className="overlapping-quote near-white">
            <div className="overlapping">
                <div className="quote-box">
                    <div className="big-orange-quote">“</div>
                    <div className="text-block">
                        <div className="quote">{quote}</div>
                        <div className="name">- {name}</div>
                        <div className="title">{title}</div>
                        <div className="school">{school}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
