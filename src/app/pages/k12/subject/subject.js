import React from 'react';
import Banner from './banner';
import Books from './books';
import Resources from './resources';
import Contact from './contact';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import { useLocation } from 'react-router-dom';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './subject.scss';

function QuickLinks({ labels, setSelectedLabel }) {
    return (
        <section className="quick-links">
            <div className="boxed">
                <strong>Quick links:</strong>
                <div className="items">
                    <a href="#books">Books</a>
                    {labels.map((text) => (
                        <a
                            href="#resources"
                            onClick={() =>
                                // Without a delay, the state variable loses its mind
                                window.setTimeout(
                                    () => setSelectedLabel(text),
                                    0
                                )}
                            key={text}
                        >
                            {text}
                        </a>
                    ))}
                    <a href="#contact">Contact us</a>
                </div>
            </div>
        </section>
    );
}

function WhatTeachersSay({ data }) {
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

function Subject({ data }) {
    const labels = ['Instructor resources', 'Student resources'];
    const [selectedLabel, setSelectedLabel] = React.useState(labels[0]);
    const { hash } = useLocation();

    React.useLayoutEffect(() => {
        const id = hash.substring(1);
        const target = document.getElementById(id);

        if (target) {
            target.scrollIntoView({ block: 'center', behavior: 'smooth' });
        } else if (id) {
            console.warn('Target not found', id);
        }
    }, [hash]);

    return (
        <div className="k12-subject page">
            <Banner data={data} />
            <QuickLinks {...{ labels, setSelectedLabel }} />
            <Books data={data} />
            <WhatTeachersSay data={data} />
            <Resources {...{ data, labels, selectedLabel, setSelectedLabel }} />
            {/* <Blogs data={data} /> */}
            <Contact data={data} />
        </div>
    );
}

export default function LoadSubject() {
    const { pathname } = useLocation();
    const slug = `pages${pathname.replace('k12/', 'k12-')}`;

    return <LoaderPage slug={slug} Child={Subject} doDocumentSetup />;
}
