import React from 'react';
import Banner from './banner';
import Books from './books';
import Resources from './resources';
import Contact from './contact';
import {useLocation} from 'react-router-dom';
import type {Book as BookInfo} from '~/pages/subjects/new/specific/context';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './subject.scss';

export type K12SubjectData = {
    quoteHeading: string;
    quoteText: string;
    resourcesHeading: string;
    facultyResourceHeaders: ResourceHeader[];
    studentResourceHeaders: ResourceHeader[];
    rfiHeading: string;
    rfiText: string;
    adoptionHeading: string;
    adoptionText: string;
    adoptionLink: string;
    adoptionLinkText: string;
    aboutBooksHeading: string;
    booksHeading: string;
    booksShortDesc: string;
    books: BookInfo[];
    blogsHeading: string;
    subheader: string;
    title: string;
    subjectIntro: string;
    subjectImage: string;
};

export type ResourceHeader = {
    heading: string;
    resourceCategory: string;
    description: string;
    comingSoon: boolean;
    comingSoonText: string;
    k12: boolean;
    videoReferenceNumber: number;
    trackResource: boolean;
    printLink: string;
    icon: string;
} & LinkData;

export type LinkData = {
    id: string;
    book: string;
    resourceUnlocked: boolean;
    linkExternal: string;
    linkDocumentUrl: string;
};

const labels = ['Instructor resources', 'Student resources'];

function QuickLinks({
    setSelectedLabel
}: {
    setSelectedLabel: (s: string) => void;
}) {
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
                                )
                            }
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

function WhatTeachersSay({data}: {data: K12SubjectData}) {
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

export default function Subject({data}: {data: K12SubjectData}) {
    const [selectedLabel, setSelectedLabel] = React.useState<string>(labels[0]);
    const {hash} = useLocation();

    React.useLayoutEffect(() => {
        const id = hash.substring(1);
        const target = document.getElementById(id);

        if (target) {
            target.scrollIntoView({block: 'center', behavior: 'smooth'});
        } else if (id) {
            console.warn('Target not found', id);
        }
    }, [hash]);

    return (
        <div className="k12-subject page">
            <Banner data={data} />
            <QuickLinks {...{labels, setSelectedLabel}} />
            <Books data={data} />
            <WhatTeachersSay data={data} />
            <Resources {...{data, labels, selectedLabel, setSelectedLabel}} />
            {/* <Blogs data={data} /> */}
            <Contact data={data} />
        </div>
    );
}
