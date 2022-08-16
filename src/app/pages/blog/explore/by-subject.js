import React from 'react';
import useBlogContext from '../blog-context';
import {Link} from 'react-router-dom';
import './by-subject.scss';

function SubjectLink({data}) {
    return (
        <div className="card">
            <div className="icon-holder">
                {data.subjectIcon && <img src={data.subjectIcon} />}
            </div>
            <div className="subject-name">
                <Link to={`/blog/explore/subject/${data.name}`}>{data.name}</Link>
            </div>
        </div>
    );
}

export default function ExploreBySubject() {
    const {subjectSnippet: categories} = useBlogContext();

    return (
        <section id="explore-by-subject">
            <h2>Explore by subject</h2>
            <div className="subject-links">
                {
                    categories.map(
                        (c) => <SubjectLink data={c} key={c.id} />
                    )
                }
            </div>
        </section>
    );
}
