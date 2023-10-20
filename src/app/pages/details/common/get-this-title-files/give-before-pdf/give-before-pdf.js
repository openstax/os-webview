import React from 'react';
import {useDataFromSlug} from '~/helpers/page-data-utils';
import {useDialog} from '~/components/dialog/dialog';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart} from '@fortawesome/free-solid-svg-icons/faHeart';
import ThankYou from './thank-you-form';
import {enroll} from '@openstax/experiments';
import './give-before-pdf.scss';
import useGiveLinks from './use-give-links';

function Downloading({data}) {
    return (
        <div className='give-before-pdf loading'>
            <img src={data.download_image} alt='' height='50' />
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

    window.open(url, 'givewindow', `menubar=0,width=${w},height=${h}`);
}

function CommonElements({data, onThankYouClick}) {
    const [controlLink, alternateLink] = useGiveLinks();
    const donationExperiment = enroll({
        name: 'Donation Experiment 2023',
        variants: [
            {
                name: 'control',
                // eslint-disable-next-line camelcase
                header_subtitle: data.header_subtitle,
                giveLink: controlLink
            },
            {
                name: 'public good',
                // eslint-disable-next-line camelcase
                header_subtitle:
                    'Join us in sustaining OpenStax as a public good for years to come by giving today.',
                giveLink: alternateLink
            }
        ]
    });

    return (
        <React.Fragment>
            <img
                className='header-image'
                src={data.header_image}
                alt=''
                height='165'
                width='165'
            />
            <p>
                <span className='header-title'>{data.header_title}</span>
                <br />
                <span>{donationExperiment.header_subtitle}</span>
            </p>
            <div className='button-row'>
                <a
                    href={donationExperiment.giveLink}
                    className='btn primary'
                    onClick={OpenGiveInNewWindow}
                    data-nudge-action='interacted'
                >
                    {data.give_link_text}
                    <FontAwesomeIcon icon={faHeart} />
                </a>
                <a
                    href={data.thank_you_link}
                    className='btn secondary'
                    onClick={onThankYouClick}
                    data-nudge-action='thank-you'
                >
                    {data.thank_you_link_text}
                </a>
            </div>
            <p className='giving-optional'>{data.giving_optional}</p>
            <hr />
        </React.Fragment>
    );
}

function GiveBeforePdfAfterConditionals({
    onThankYouClick,
    link,
    data,
    close,
    onDownload
}) {
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

function useOnThankYouClick() {
    const [showThankYou, setShowThankYou] = React.useState(false);
    const onThankYouClick = React.useCallback((event) => {
        event.preventDefault();
        setShowThankYou(true);
    }, []);

    return {showThankYou, onThankYouClick};
}

function GiveBeforePdf({link, close, data, onDownload}) {
    const [doneDownloading, setDoneDownloading] = React.useState(false);
    const {showThankYou, onThankYouClick} = useOnThankYouClick();

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
        <GiveBeforePdfAfterConditionals
            {...{onThankYouClick, link, data, close, onDownload}}
        />
    );
}

function GiveBeforeOnline({link, close, data}) {
    const {showThankYou, onThankYouClick} = useOnThankYouClick();

    if (showThankYou) {
        return <ThankYou link={link} close={close} />;
    }

    return (
        <div
            className='give-before-pdf'
            data-analytics-view
            data-analytics-nudge='donate'
        >
            <CommonElements data={data} onThankYouClick={onThankYouClick} />
            <a href={link} onClick={close} className='btn go-to'>
                Go to your book
            </a>
        </div>
    );
}

function lookupVariant(variant) {
    if (variant === 'online') {
        return GiveBeforeOnline;
    }
    return GiveBeforePdf;
}

export default function useGiveDialog() {
    const [Dialog, open, close] = useDialog();
    const data1 = useDataFromSlug('donations/donation-popup');
    const data = React.useMemo(
        () => (data1?.length > 0 ? data1[0] : {}),
        [data1]
    );

    const GiveDialog = React.useCallback(
        ({link, onDownload, variant}) => {
            const Variant = lookupVariant(variant);

            return (
                <Dialog>
                    <Variant {...{link, close, data, onDownload}} />
                </Dialog>
            );
        },
        [close, data, Dialog]
    );

    return {
        GiveDialog,
        open,
        enabled: !data.hide_donation_popup
    };
}
