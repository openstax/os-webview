import React from 'react';
import './big-quote.css';

export default function ({text, name, title, school, backgroundImage, ...other}) {
    return (
        <section className="big-quote">
            <div className="background-image" style={{backgroundImage: `url(${backgroundImage})`}} />
            <div className="gradient-overlay" />
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
