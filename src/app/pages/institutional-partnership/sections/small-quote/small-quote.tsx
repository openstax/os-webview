import React from 'react';
import './small-quote.scss';

export type SmallQuoteProps = {
    text: string;
    name: string;
    title: string;
    school: string;
};

export default function SmallQuote({
    text,
    name,
    title,
    school
}: SmallQuoteProps) {
    return (
        <section className="small-quote near-white">
            <div className="content">
                <div className="big-quote-mark">&quot;</div>
                <div className="text-block">
                    <div className="quote">{text}</div>
                    <div className="name">- {name}</div>
                    <div className="title">{title}</div>
                    <div className="school">{school}</div>
                </div>
            </div>
        </section>
    );
}
