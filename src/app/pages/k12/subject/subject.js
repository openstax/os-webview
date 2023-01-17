import React from 'react';
import Banner from './banner';
import Books from './books';
import Resources from './resources';
import Blogs from './blogs';
import Contact from './contact';
import './subject.scss';

const data = {
    testimonial2Header: 'What our teachers say',
    testimonial2Quote: `It's wonderful to have high-quality resources that may
    be used with students and no budget impact.`
};

function QuickLinks() {
    return (
        <section className="quick-links">
            <div className="boxed">
                <strong>Quick links:</strong>
                <div className="items">
                    <a href="#books">Books</a>
                    <a href="#instructor-resources">Instructor Resources</a>
                    <a href="#student-resources">Student Resources</a>
                    <a href="#other">Other</a>
                </div>
            </div>
        </section>
    );
}

function WhatTeachersSay() {
    return (
        <section className="what-teachers-say">
            <div className="boxed">
                <div className="left_col">
                    <h2>{data.testimonial2Header}</h2>
                </div>
                <div className="right_col">
                    &ldquo;{data.testimonial2Quote}&rdquo;
                </div>
            </div>
        </section>
    );
}

export default function Subject() {
    return (
        <div className="k12-subject page">
            <Banner />
            <QuickLinks />
            <Books />
            <WhatTeachersSay />
            <Resources />
            <Blogs />
            <Contact />
        </div>
    );
}
