import React, {useEffect} from 'react';
import Dialog from '~/components/dialog/dialog';
import useDialogContext, {DialogContextProvider} from './dialog-context';
import PartnerDetails from '../partner-details/partner-details';
import StarsAndCount from '~/components/stars-and-count/stars-and-count';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import {useNavigate, useLocation} from 'react-router-dom';
import analyticsEvents from '../analytics-events';

function modelFromEntry(entry) {
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

function ResultCard({entry}) {
    const {
        id, type, title, logoUrl, verifiedFeatures, badgeImage, tags, rating, ratingCount
    } = modelFromEntry(entry);
    const summary = {count: ratingCount, rating};
    const navigate = useNavigate();
    const onSelect = React.useCallback(
        (event) => {
            event.preventDefault();
            const href = event.currentTarget.getAttribute('href');

            navigate(href, {replace: true});
        },
        [navigate]
    );

    return (
        <a
            href={`?${encodeURIComponent(title)}`} type="button"
            className="card"
            onClick={onSelect}
            data-analytics-select-content={id}
            data-content-type="partner_profile"
            data-content-name={title}
            data-content-categories={type}
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
            <StarsAndCount
                rating={summary.rating}
                count={summary.count}
                showNumber />
        </a>
    );
}

function usePartnerFromLocation(entries) {
    const {pathname, search} = useLocation();
    const partner = React.useMemo(
        () => {
            const paramKeys = Array.from(new window.URLSearchParams(search).keys());

            return entries.find((e) => paramKeys.includes(e.title));
        },
        [entries, search]
    );
    const navigate = useNavigate();
    const closePartner = React.useCallback(
        () => navigate(pathname, {replace: true}),
        [pathname, navigate]
    );
    const sendDetailEvent = analyticsEvents.usePartnerDetailsEvent();

    useEffect(() => {
        if (partner?.title) {
            sendDetailEvent(partner.title);
        }
    }, [sendDetailEvent, partner]);

    return [partner, closePartner];
}

function DialogInContext(dialogProps) {
    const {title} = useDialogContext();

    return (
        <Dialog title={title} {...dialogProps} />
    );
}

export default function ResultGrid({entries, linkTexts}) {
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
