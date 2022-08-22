import React, {useState, useEffect} from 'react';
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

function ResultCard({entry, setPartner}) {
    const {
        title, logoUrl, verifiedFeatures, badgeImage, tags, rating, ratingCount
    } = modelFromEntry(entry);
    const summary = {count: ratingCount, rating};
    const navigate = useNavigate();

    function onSelect(event) {
        event.preventDefault();
        event.stopPropagation();
        const href = event.currentTarget.getAttribute('href');

        navigate(href, {replace: true});
        setPartner(entry);
    }

    return (
        <a href={`?${title}`} type="button" className="card" onClick={onSelect}>
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
    const searchArgs = window.location.search.substr(1).split('&').map(decodeURIComponent);
    const [partner, setPartner] = useState(entries.find((e) => searchArgs.includes(e.title)));
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (partner) {
            analyticsEvents.partnerDetails(partner.title);
        }
    }, [partner]);

    function closePartner() {
        navigate(location.pathname, {replace: true});
        setPartner();
    }

    return [partner, setPartner, closePartner];
}

function DialogInContext(dialogProps) {
    const {title} = useDialogContext();

    return (
        <Dialog title={title} {...dialogProps} />
    );
}

export default function ResultGrid({entries, linkTexts}) {
    const [partner, setPartner, closePartner] = usePartnerFromLocation(entries);
    const detailData = {...partner, ...linkTexts};

    return (
        <div className="boxed grid">
            {
                entries.map((entry) =>
                    <ResultCard
                        key={entry.title}
                        entry={entry}
                        setPartner={setPartner}
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
