import React from 'react';
import ThankYou, {useOnThankYouClick} from './thank-you-form';
import useGiveLinks from './use-give-links';
import CommonElements from './common-elements';
import type {DonationPopupData} from './use-donation-popup-data';

export default function GiveBeforeOnline({
    link,
    close,
    data
}: {
    link: string;
    close: () => void;
    data: DonationPopupData;
}) {
    const {showThankYou, onThankYouClick} = useOnThankYouClick();
    const [controlLink] = useGiveLinks();

    if (showThankYou) {
        return <ThankYou link={link} close={close} />;
    }

    return (
        <div
            className='give-before-pdf'
            data-analytics-view
            data-analytics-nudge='donate'
        >
            <CommonElements
                data={data}
                onThankYouClick={onThankYouClick}
                giveLink={controlLink}
            />
            <a href={link} onClick={close} className='btn go-to'>
                Go to your book
            </a>
        </div>
    );
}
