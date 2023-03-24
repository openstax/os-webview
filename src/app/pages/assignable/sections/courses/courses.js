import React from 'react';
import './courses.scss';

function BookInfo({data}) {
    return (
        <div>
            <img src={data.cover} alt="" />
            <div>{data.title}</div>
        </div>

    );
}

function CourseList({heading, courses}) {
    return (
        <div>
            <h2>{heading}</h2>
            <div className="course-list">
                { courses.map((c) => <BookInfo data={c} key={c.title} />) }
            </div>
        </div>
    );
}

export default function Courses({data}) {
    console.info('DATA', data);
    return (
        <section className="courses white">
            <div className="content-block">
                <CourseList heading={data.availableCoursesHeader} courses={data.availableBooks} />
                <CourseList heading={data.coursesComingSoonHeader} courses={data.comingSoonBooks} />
            </div>
        </section>
    );
}
