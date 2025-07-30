import React from 'react';
import ThankYou, {useOnThankYouClick} from './thank-you-form';
import CommonElements from './common-elements';
import type {DonationPopupData} from './use-donation-popup-data';
import {enroll} from '@openstax/experiments';
import useGiveLinks from './use-give-links';
import './give-before-pdf.scss';

export default function GiveBeforePdf({
    link,
    track,
    close,
    data,
    onDownload,
    id
}: {
    link: string;
    track?: string;
    close: () => void;
    data: DonationPopupData;
    onDownload?: () => void;
    id?: string;
}) {
    const [doneDownloading, setDoneDownloading] = React.useState(false);
    const {showThankYou, onThankYouClick} = useOnThankYouClick();

    React.useEffect(() => {
        window.setTimeout(() => setDoneDownloading(true), 700);
    }, []);

    if (!data.download_ready || !doneDownloading) {
        return <Downloading data={data} />;
    }

    if (showThankYou) {
        return <ThankYou link={link} close={close} source='PDF download' track={track} id={id} />;
    }

    return (
        <GiveBeforePdfAfterConditionals
            {...{onThankYouClick, link, track, data, close, onDownload}}
        />
    );
}

function Downloading({data}: {data: DonationPopupData}) {
    return (
        <div className='give-before-pdf loading'>
            <img src={data.download_image} alt='' height='50' />
            <p>Downloading...</p>
        </div>
    );
}

function GiveBeforePdfAfterConditionals({
    onThankYouClick,
    link,
    track,
    data,
    close,
    onDownload
}: {
    onThankYouClick: ReturnType<typeof useOnThankYouClick>['onThankYouClick'];
    link: string;
    track?: string;
    data: DonationPopupData;
    close: () => void;
    onDownload?: React.MouseEventHandler;
}) {
    const [controlLink, alternateLink] = useGiveLinks();
    const variants = [
        {
            name: 'control',
            headerSubtitle: data.header_subtitle,
            giveLink: controlLink
        },
        {
            name: 'public good',
            headerSubtitle:
                'Join us in sustaining OpenStax as a public good for years to come by giving today.',
            giveLink: alternateLink
        }
    ];
    const donationExperiment = enroll({
        name: 'Donation Experiment 2023',
        variants
    });

    React.useEffect(() => {
        window.dataLayer ||= [];
        window.dataLayer.push({
            event: 'optimize.giveBeforePdf'
        });
    });

    const closeAfterDelay = React.useCallback(
        (event: React.MouseEvent) => {
            if (onDownload) {
                onDownload(event);
            }
            window.setTimeout(close, 200);
        },
        [close, onDownload]
    );

    return (
        <div
            className='give-before-pdf'
            data-analytics-view
            data-analytics-nudge='donate'
            data-nudge-placement='PDF download'
        >
            <img className='download-icon' src={data.download_image} alt='' />
            <h1 id="dialog-heading">{data.download_ready}</h1>
            <hr />
            <CommonElements
                onThankYouClick={onThankYouClick}
                data={data}
                giveLink={donationExperiment.giveLink}
                headerSubtitle={donationExperiment.headerSubtitle}
            />
            <a
                href={link}
                {...(track ? {'data-track': track} : {})}
                onClick={closeAfterDelay}
                className='btn go-to'
            >
                Go to your file
            </a>
        </div>
    );
}
