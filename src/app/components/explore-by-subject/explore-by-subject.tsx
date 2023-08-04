import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Category} from './types';
import './explore-by-subject.scss';

function SubjectLink({
    category: {name, subjectIcon},
    from
}: {
    category: Category;
    from: string;
}) {
    return (
        <div className='card'>
            <Link to={`./explore/subject/${name}`} state={{from}}>
                <div className='icon-holder'>
                    {subjectIcon && <img src={subjectIcon} />}
                </div>
                <div className='subject-name'>
                    {name}
                </div>
            </Link>
        </div>
    );
}

export default function ExploreBySubject({
    categories,
    analyticsNav
}: {
    categories: Category[];
    analyticsNav: string;
}) {
    const {pathname} = useLocation();

    return (
        <section id='explore-by-subject'>
            <h2>Explore by subject</h2>
            <div className='subject-links' data-analytics-nav={analyticsNav}>
                {categories.map((c) => (
                    <SubjectLink category={c} key={c.id} from={pathname} />
                ))}
            </div>
        </section>
    );
}
