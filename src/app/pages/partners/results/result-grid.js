import React, {useEffect} from 'react';
import shellBus from '~/components/shell/shell-bus';
import PartnerDetails from '../partner-details/partner-details';

function modelFromEntry(entry) {
    return {
        title: entry.title,
        logoUrl: entry.logoUrl,
        description: entry.blurb,
        tags: entry.tags,
        verifiedFeatures: entry.verifiedFeatures,
        badgeImage: '/images/partners/verified-badge.svg'
    };
}

function baseHref() {
    const h = new URL(window.location.href);

    h.search = '';
    return h.href;
}

function showDetailDialog({entry, linkTexts}) {
    const detailData = {...entry, ...linkTexts};
    const pd = new PartnerDetails(detailData);
    const onOutsideClick = () => {
        shellBus.emit('hideDialog');
    };

    window.addEventListener('click', onOutsideClick);
    shellBus.emit('showDialog', () => ({
        title: '',
        content: pd,
        onClose() {
            window.removeEventListener('click', onOutsideClick);
            history.replaceState('', '', baseHref());
        }
    }));
}

function ResultCard({entry, linkTexts}) {
    const model = modelFromEntry(entry);

    function onSelect(event) {
        event.preventDefault();
        event.stopPropagation();
        history.replaceState('', '', event.currentTarget.href);
        showDetailDialog({entry, linkTexts});
    }

    return (
        <a href={`?${model.title}`} type="button" className="card" onClick={onSelect}>
            <div className="logo">
                {
                    model.logoUrl && <img src={model.logoUrl} alt="" />
                }
            </div>
            {
                model.verifiedFeatures &&
                <div className="badge">
                    <img className="background" src={model.badgeImage} alt="verified" />
                    <i className="checkmark fa fa-check"></i>
                    <div className="tooltip top">
                        {model.verifiedFeatures}
                    </div>
                </div>
            }
            <div className="resource-title">{model.title}</div>
            <div className="resource-description">{model.description}</div>
            <div className="tags">
                {
                    model.tags.map(({value, label}) =>
                        <span key={value}>{label}: {value}</span>
                    )
                }
            </div>
        </a>
    );
}


export default function ResultGrid({entries, linkTexts}) {
    useEffect(() => {
        const searchArgs = window.location.search.substr(1).split('&').map(decodeURIComponent);
        const foundPartner = entries.find((entry) => searchArgs.some((arg) => entry.title === arg));

        if (foundPartner) {
            showDetailDialog({entry: foundPartner, linkTexts});
        }
    }, []);

    return (
        <div className="boxed grid">
            {
                entries.map((entry) =>
                    <ResultCard
                        key={entry.title}
                        entry={entry}
                        linkTexts={linkTexts}
                    />
                )
            }
        </div>
    );
};
