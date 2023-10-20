import React from 'react';
import ThankYou, {useOnThankYouClick} from './thank-you-form';
import CommonElements from './common-elements';
import type {DonationPopupData} from './use-donation-popup-data';
import './give-before-pdf.scss';

export default function GiveBeforePdf({
    link,
    close,
    data,
    onDownload
}: {
    link: string;
    close: () => void;
    data: DonationPopupData;
    onDownload: () => void;
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
        return <ThankYou link={link} close={close} />;
    }

    return (
        <GiveBeforePdfAfterConditionals
            {...{onThankYouClick, link, data, close, onDownload}}
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
    data,
    close,
    onDownload
}: {
    onThankYouClick: ReturnType<typeof useOnThankYouClick>['onThankYouClick'];
    link: string;
    data: DonationPopupData;
    close: () => void;
    onDownload: (event: React.MouseEvent) => void;
}) {
    React.useEffect(() => {
        if ('dataLayer' in window) {
            (window.dataLayer as Array<object>).push({
                event: 'optimize.giveBeforePdf'
            });
        }
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
            <h1>{data.download_ready}</h1>
            <hr />
            <CommonElements onThankYouClick={onThankYouClick} data={data} />
            <a href={link} onClick={closeAfterDelay} className='btn go-to'>
                Go to your file
            </a>
        </div>
    );
}
