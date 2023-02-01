import React from 'react';
import Banner from './banner';
import Books from './books';
import Resources from './resources';
import Blogs from './blogs';
import Contact from './contact';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import {useLocation} from 'react-router-dom';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './subject.scss';

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

function WhatTeachersSay({data}) {
    return (
        <section className="what-teachers-say">
            <div className="boxed">
                <div className="left_col">
                    <h2>{data.quoteHeading}</h2>
                </div>
                <RawHTML className="right_col" html={data.quoteText} />
            </div>
        </section>
    );
}

function Subject({data}) {
    return (
        <div className="k12-subject page">
            <Banner data={data} />
            <QuickLinks />
            <Books data={data} />
            <WhatTeachersSay data={data} />
            <Resources data={data} />
            <Blogs data={data} />
            <Contact data={data} />
        </div>
    );
}

export default function LoadSubject() {
    const {pathname} = useLocation();
    const slug = `pages${pathname.replace('k12/', 'k12-')}`;

    return (
        <LoaderPage slug={slug} Child={Subject} doDocumentSetup />
    );
}
