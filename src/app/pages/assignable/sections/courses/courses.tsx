import React from 'react';
import './courses.scss';

type BookData = {
    cover: string;
    title: string;
};

function BookInfo({data}: {data: BookData}) {
    return (
        <div>
            <img src={data.cover} alt="" />
            <div>{data.title}</div>
        </div>
    );
}

function CourseList({
    heading,
    courses
}: {
    heading: string;
    courses: BookData[];
}) {
    return (
        <div>
            <h2>{heading}</h2>
            <div className="course-list">
                {courses.map((c) => (
                    <BookInfo data={c} key={c.title} />
                ))}
            </div>
        </div>
    );
}

type CoursesProps = {
    data: {
        availableCoursesHeader: string;
        availableBooks: BookData[];
        coursesComingSoonHeader: string;
        comingSoonBooks: BookData[];
    };
};

export default function Courses({data}: CoursesProps) {
    return (
        <section className="courses white">
            <div className="content-block">
                <CourseList
                    heading={data.availableCoursesHeader}
                    courses={data.availableBooks}
                />
                <CourseList
                    heading={data.coursesComingSoonHeader}
                    courses={data.comingSoonBooks}
                />
            </div>
        </section>
    );
}
