import React from 'react';
import {useDataFromSlug} from '~/components/jsx-helpers/jsx-helpers.jsx';
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

function GiveBeforePdfAfterConditionals({onThankYouClick, link, data}) {
    React.useEffect(() => {
        if (window.dataLayer) {
            window.dataLayer.push({event: 'optimize.giveBeforePdf'});
        }
    });

    return (
        <div className="give-before-pdf">
            <img src={data.download_image} alt="" />
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
                <a href={data.give_link} className="btn primary" onClick={OpenGiveInNewWindow}>
                    {data.give_link_text}
                    <FontAwesomeIcon icon={faHeart} />
                </a>
                <a href={data.thank_you_link} className="btn secondary" onClick={onThankYouClick}>
                    {data.thank_you_link_text}
                </a>
            </div>
            <p className="giving-optional">{data.giving_optional}</p>
            <hr />
            <a href={link} className="btn go-to">Go to PDF</a>
        </div>
    );
}

function GiveBeforePdf({
    link, showThankYou, setShowThankYou, doneDownloading, close, data
}) {
    if (!data.download_ready || !doneDownloading) {
        return <Downloading data={data} />;
    }

    if (showThankYou) {
        return <ThankYou link={link} close={close} />;
    }

    function onThankYouClick(event) {
        event.preventDefault();
        setShowThankYou(true);
    }


    return (
        <GiveBeforePdfAfterConditionals {...{onThankYouClick, link, data}} />
    );
}

export default function useGiveDialog() {
    const [Dialog, open, close] = useDialog();
    const data1 = useDataFromSlug('donations/donation-popup');
    const data = (data1?.length > 0) ? data1[0] : {};

    function GiveDialog({link}) {
        const [showThankYou, setShowThankYou] = React.useState(false);
        const [doneDownloading, setDoneDownloading] = React.useState(false);

        React.useEffect(
            () => window.setTimeout(() => setDoneDownloading(true), 700),
            []
        );

        return (
            <Dialog>
                <GiveBeforePdf
                    {...{
                        link, showThankYou, setShowThankYou,
                        doneDownloading, close, data
                    }} />
            </Dialog>
        );
    }

    return {
        GiveDialog,
        open,
        enabled: !data.hide_donation_popup
    };
}
