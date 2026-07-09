import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Category} from './types';
import './explore-by.scss';

/* Formerly, it would explore by either (subject) Category or Collection,
 * but now it's subject-only */
export default function ExploreBy({
    items,
    title,
    analyticsNav
}: {
    items: Category[];
    title: string;
    analyticsNav: string;
}) {
    const {pathname} = useLocation();

    return (
        <section className="explore-by">
            <h2>{title}</h2>
            <div className="item-links" data-analytics-nav={analyticsNav}>
                {items.map((item) => {
                    const key = String(item.id);

                    return (
                        <ItemLink
                            key={key}
                            item={item}
                            from={pathname}
                        />
                    );
                })}
            </div>
        </section>
    );
}

function ItemLink({
    item,
    from
}: {
    item: Category;
    from: string;
}) {
    const name = item.name;
    const icon = item.subjectIcon;

    return (
        <div className="card">
            <Link
                to={`./explore/subjects/${encodeURIComponent(name)}`}
                state={{from}}
            >
                <div className="icon-holder">
                    {icon && <img src={icon} alt="" />}
                </div>
                <div className="item-name">{name}</div>
            </Link>
        </div>
    );
}
