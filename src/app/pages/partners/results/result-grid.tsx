import React from 'react';
import {useNavigate} from 'react-router-dom';
import type {PartnerEntry} from './results';

function modelFromEntry(entry: PartnerEntry) {
    return {
        type: entry.type,
        title: entry.title,
        logoUrl: entry.logoUrl,
        description: entry.blurb,
        tags: entry.tags,
        badgeImage: '/dist/images/partners/verified-badge.svg'
    };
}

function ResultCard({entry}: {entry: PartnerEntry}) {
    const {type, title, logoUrl, tags} =
        modelFromEntry(entry);
    const navigate = useNavigate();
    const onSelect = React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            const href = event.currentTarget.getAttribute('href');

            navigate(href as string, {replace: true});
        },
        [navigate]
    );

    return (
        <a
            href={`?${encodeURIComponent(title)}`}
            type="button"
            className="card"
            onClick={onSelect}
            data-analytics-select-content={title}
            data-content-type="Partner Profile"
            data-content-tags={`,category=${type},`}
        >
            <div className="logo">
                {logoUrl && <img src={logoUrl} alt="" />}
            </div>
            <div className="resource-title">{title}</div>
            <div className="tags">
                {tags.map(({value}) => (
                    <div key={value}>{value}</div>
                ))}
            </div>
        </a>
    );
}

export default function ResultGrid({entries}: {entries: PartnerEntry[]}) {
    return (
        <div className="boxed grid">
            {entries.map((entry) => (
                <ResultCard key={entry.title} entry={entry} />
            ))}
        </div>
    );
}
