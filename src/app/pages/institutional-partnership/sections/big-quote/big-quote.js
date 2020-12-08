import React from 'react';
import './big-quote.css';

export default function ({text, name, title, school, backgroundImage, ...other}) {
    return (
        <section className="big-quote">
            <div class="background-image" style={{backgroundImage: `url(${backgroundImage})`}} />
            <div class="gradient-overlay" />
            <div class="content">
                <div class="big-quote-mark">“</div>
                <div class="text-block">
                    <div class="quote">{text}</div>
                    <div class="name">- {name}</div>
                    <div class="title">{title}</div>
                    <div class="school">{school}</div>
                </div>
            </div>
        </section>
    );
}
