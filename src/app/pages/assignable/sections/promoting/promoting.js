import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './promoting.scss';

function CourseList({heading, courses}) {
    return (
        <React.Fragment>
            <h2>{heading}</h2>
            <div className="courses">
                {
                    courses.map(
                        (item) => <div key={item}>{item}</div>
                    )
                }
            </div>
        </React.Fragment>
    );
}

export default function Promoting({
    heading1, courses1,
    heading2, courses2,
    html
}) {
    return (
        <section className="promoting white">
            <div className="content-block">
                <CourseList heading={heading1} courses={courses1} />
                <CourseList heading={heading2} courses={courses2} />
                <RawHTML html={html} />
            </div>
        </section>
    );
}
