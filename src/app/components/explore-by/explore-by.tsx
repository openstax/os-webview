import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {ExploreItem, isCategory} from './types';
import './explore-by.scss';

export default function ExploreBy({
    items,
    title,
    analyticsNav,
    basePath
}: {
    items: ExploreItem[];
    title: string;
    analyticsNav: string;
    basePath: 'subjects' | 'collections';
}) {
    const {pathname} = useLocation();

    return (
        <section className="explore-by">
            <h2>{title}</h2>
            <div className="item-links" data-analytics-nav={analyticsNav}>
                {items.map((item) => {
                    const key = isCategory(item) ? String(item.id) : item.id;

                    return (
                        <ItemLink
                            key={key}
                            item={item}
                            from={pathname}
                            basePath={basePath}
                        />
                    );
                })}
            </div>
        </section>
    );
}

function ItemLink({
    item,
    from,
    basePath
}: {
    item: ExploreItem;
    from: string;
    basePath: 'subjects' | 'collections';
}) {
    const name = item.name;
    const icon = isCategory(item) ? item.subjectIcon : item.collectionImage;

    return (
        <div className="card">
            <Link
                to={`./explore/${basePath}/${encodeURIComponent(name)}`}
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
