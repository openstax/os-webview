import React from 'react';
import Dialog from '~/components/dialog/dialog';
import useDialogContext, {DialogContextProvider} from './dialog-context';
import PartnerDetails from '../partner-details/partner-details';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import {useNavigate, useLocation} from 'react-router-dom';
import type { LinkTexts, PartnerEntry } from './results';

function modelFromEntry(entry: PartnerEntry) {
    return {
        id: entry.id,
        type: entry.type,
        title: entry.title,
        logoUrl: entry.logoUrl,
        description: entry.blurb,
        tags: entry.tags,
        verifiedFeatures: entry.verifiedFeatures,
        badgeImage: '/dist/images/partners/verified-badge.svg',
        rating: entry.rating,
        ratingCount: entry.ratingCount
    };
}

function ResultCard({entry}: {entry: PartnerEntry}) {
    const {
        type, title, logoUrl, verifiedFeatures, badgeImage, tags
    } = modelFromEntry(entry);
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
            href={`?${encodeURIComponent(title)}`} type="button"
            className="card"
            onClick={onSelect}
            data-analytics-select-content={title}
            data-content-type="Partner Profile"
            data-content-tags={`,category=${type},`}
        >
            <div className="logo">
                {logoUrl && <img src={logoUrl} alt="" />}
            </div>
            {
                verifiedFeatures &&
                <div className="badge">
                    <img className="background" src={badgeImage} alt="verified" />
                    <FontAwesomeIcon icon={faCheck} />
                    <div className="tooltip top">
                        {verifiedFeatures}
                    </div>
                </div>
            }
            <div className="resource-title">{title}</div>
            <div className="tags">
                {tags.map(({value}) => <div key={value}>{value}</div>)}
            </div>
            {/*
            <StarsAndCount
                rating={summary.rating}
                count={summary.count}
                showNumber />
            */}
        </a>
    );
}

function usePartnerFromLocation(entries: PartnerEntry[]):
[PartnerEntry, () => void] {
    const {pathname, search} = useLocation();
    const partner = React.useMemo(
        () => {
            const paramKeys = Array.from(new window.URLSearchParams(search).keys());

            return entries.find((e) => paramKeys.includes(e.title)) as PartnerEntry;
        },
        [entries, search]
    );
    const navigate = useNavigate();
    const closePartner = React.useCallback(
        () => navigate(pathname, {replace: true}),
        [pathname, navigate]
    );

    return [partner, closePartner];
}

function DialogInContext(dialogProps: Parameters<typeof Dialog>[0]) {
    const {title} = useDialogContext();

    return (
        <Dialog title={title} {...dialogProps} />
    );
}

export default function ResultGrid({entries, linkTexts}: {
    entries: PartnerEntry[];
    linkTexts?: LinkTexts;
}) {
    const [partner, closePartner] = usePartnerFromLocation(entries);
    const detailData = {...partner, ...linkTexts};

    return (
        <div className="boxed grid">
            {
                entries.map((entry) =>
                    <ResultCard
                        key={entry.title}
                        entry={entry}
                    />
                )
            }
            <DialogContextProvider contextValueParameters={partner}>
                <DialogInContext isOpen={Boolean(partner)} onPutAway={closePartner}>
                    {
                        Boolean(partner) &&
                            <PartnerDetails detailData={detailData} />
                    }
                </DialogInContext>
            </DialogContextProvider>
        </div>
    );
}
