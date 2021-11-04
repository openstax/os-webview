import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './subject-intro.scss';

const paragraphHtml = `
    <b>Simple to use, simple to adopt.</b> Our online business textbooks are designed
    to meet the standard scope and sequence requirements of several business
    courses – and are 100% free. Complete with free resources for educators
    (like course cartridges, PowerPoints, test banks, and more), check out our
    books to see if they&apos;re right for your course.
`;

export default function SubjectIntro({subjectName}) {
    return (
        <section className="subject-intro">
            <div className="content">
                <div>Open textbooks</div>
                <h1>{subjectName}</h1>
                <RawHTML className="paragraph-html" html={paragraphHtml} />
            </div>
        </section>
    );
}
