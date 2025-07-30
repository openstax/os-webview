import React from 'react';
import {useNavigate} from 'react-router-dom';
import type {PartnerEntry} from './results';
import PartnerCard from '~/components/partner-card/partner-card';

export const badgeImage = '/dist/images/partners/verified-badge.svg';
export function useOnSelect() {
    const navigate = useNavigate();

    return React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            const href = event.currentTarget.getAttribute('href');

            navigate(href as string, {replace: true});
        },
        [navigate]
    );
}

function ResultCard({entry}: {entry: PartnerEntry}) {
    const {type, title, logoUrl, tags} = entry;
    const onSelect = useOnSelect();

    return (
        <PartnerCard
            type={type}
            href={`?${encodeURIComponent(title)}`}
            title={title}
            logoUrl={logoUrl}
            tags={tags.map((t) => t.value).filter((v) => v !== null)}
            onClick={onSelect}
            badgeImage={badgeImage}
            analyticsContentType="Partner Profile"
        />
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
