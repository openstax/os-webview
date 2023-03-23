import React from 'react';
import './courses.scss';

function CourseList({heading, courses}) {
    return (
        <React.Fragment>
            <h2>{heading}</h2>
            <div className="courses">{courses}</div>
        </React.Fragment>
    );
}

export default function Courses({
    data: {
        availableCoursesHeader: heading1,
        availableCourses: courses1,
        coursesComingSoonHeader: heading2,
        coursesComingSoon: courses2

    }
}) {
    return (
        <section className="promoting white">
            <div className="content-block">
                <CourseList heading={heading1} courses={courses1} />
                <CourseList heading={heading2} courses={courses2} />
            </div>
        </section>
    );
}
