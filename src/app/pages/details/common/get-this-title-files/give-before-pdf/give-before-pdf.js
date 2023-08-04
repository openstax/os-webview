import React from 'react';
import {useDataFromSlug} from '~/helpers/page-data-utils';
import {useDialog} from '~/components/dialog/dialog';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart} from '@fortawesome/free-solid-svg-icons/faHeart';
import ThankYou from './thank-you-form';
import './give-before-pdf.scss';

function Downloading({data}) {
    return (
        <div className="give-before-pdf loading">
            <img src={data.download_image} alt="" height="50" />
            <p>Downloading...</p>
        </div>
    );
}

function OpenGiveInNewWindow(event) {
    event.preventDefault();
    const url = event.target.href;
    const {innerWidth, innerHeight} = window;
    const w = 0.8 * innerWidth;
    const h = 0.8 * innerHeight;

    window.open(
        url,
        'givewindow',
        `menubar=0,width=${w},height=${h}`
    );
}

function GiveBeforePdfAfterConditionals({onThankYouClick, link, data, close, onDownload}) {
    React.useEffect(() => {
        if (window.dataLayer) {
            window.dataLayer.push({event: 'optimize.giveBeforePdf'});
        }
    });

    const closeAfterDelay = React.useCallback(
        (event) => {
            if (onDownload) {
                onDownload(event);
            }
            window.setTimeout(close, 200);
        },
        [close, onDownload]
    );

    return (
        <div
            className="give-before-pdf"
            data-analytics-view
            data-analytics-nudge="donate"
            data-nudge-placement="PDF download"
        >
            <img className="download-icon" src={data.download_image} alt="" />
            <h1>{data.download_ready}</h1>
            <hr />
            <img
                className="header-image" src={data.header_image} alt=""
                height="165" width="165"
            />
            <p>
                <span className="header-title">{data.header_title}</span>
                <br />
                <span>{data.header_subtitle}</span>
            </p>
            <div className="button-row">
                <a
                    href={data.give_link}
                    className="btn primary"
                    onClick={OpenGiveInNewWindow}
                    data-nudge-action="interacted"
                >
                    {data.give_link_text}
                    <FontAwesomeIcon icon={faHeart} />
                </a>
                <a
                    href={data.thank_you_link}
                    className="btn secondary"
                    onClick={onThankYouClick}
                    data-nudge-action="thank-you"
                >
                    {data.thank_you_link_text}
                </a>
            </div>
            <p className="giving-optional">{data.giving_optional}</p>
            <hr />
            <a href={link} onClick={closeAfterDelay} className="btn go-to">Go to your file</a>
        </div>
    );
}

function GiveBeforePdf({
    link, close, data, onDownload
}) {
    const [showThankYou, setShowThankYou] = React.useState(false);
    const [doneDownloading, setDoneDownloading] = React.useState(false);
    const onThankYouClick = React.useCallback(
        (event) => {
            event.preventDefault();
            setShowThankYou(true);
        },
        []
    );

    React.useEffect(
        () => window.setTimeout(() => setDoneDownloading(true), 700),
        []
    );

    if (!data.download_ready || !doneDownloading) {
        return <Downloading data={data} />;
    }

    if (showThankYou) {
        return <ThankYou link={link} close={close} />;
    }

    return (
        <GiveBeforePdfAfterConditionals {...{onThankYouClick, link, data, close, onDownload}} />
    );
}

export default function useGiveDialog() {
    const [Dialog, open, close] = useDialog();
    const data1 = useDataFromSlug('donations/donation-popup');
    const data = React.useMemo(
        () => (data1?.length > 0) ? data1[0] : {},
        [data1]
    );
    const GiveDialog = React.useCallback(
        ({link, onDownload}) => {
            return (
                <Dialog>
                    <GiveBeforePdf {...{link, close, data, onDownload}} />
                </Dialog>
            );
        },
        [close, data]
    );

    return {
        GiveDialog,
        open,
        enabled: !data.hide_donation_popup
    };
}
