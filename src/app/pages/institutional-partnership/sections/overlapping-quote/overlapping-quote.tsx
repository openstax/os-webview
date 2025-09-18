import React from 'react';
import './overlapping-quote.scss';

export type OverlappingQuoteProps = {
    quote: string;
    name: string;
    title: string;
    school: string;
};

export default function OverlappingQuote({quote, name, title, school}: OverlappingQuoteProps) {
    return (
        <section className="overlapping-quote near-white">
            <div className="overlapping">
                <div className="quote-box">
                    <div className="big-orange-quote">&quot;</div>
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
