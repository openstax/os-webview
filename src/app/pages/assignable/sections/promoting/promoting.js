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
    data: {
        heading1 = 'Available courses',
        courses1 = ['need', 'book', 'query'],
        coursesComingSoon: html
    }
}) {
    return (
        <section className="promoting white">
            <div className="content-block">
                <CourseList heading={heading1} courses={courses1} />
                <RawHTML html={html} />
            </div>
        </section>
    );
}
