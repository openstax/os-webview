import React from 'react';
import './small-quote.css';

export default function SmallQuote({text, name, title, school}) {
    return (
        <section className="small-quote near-white">
            <div className="content">
                <div className="big-quote-mark">“</div>
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
