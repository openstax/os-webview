import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import useSpecificSubjectContext from './context';
import './subject-intro.scss';

export default function SubjectIntro({subjectName}) {
    const {introText, introHtml} = useSpecificSubjectContext();

    return (
        <section className="subject-intro">
            <div className="content">
                <div>{introText}</div>
                <h1>{subjectName}</h1>
                <RawHTML className="paragraph-html" html={introHtml} />
            </div>
        </section>
    );
}
