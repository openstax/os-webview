import React from 'react';
import ThankYou, {useOnThankYouClick} from './thank-you-form';
import useGiveLinks from './use-give-links';
import CommonElements from './common-elements';
import type {DonationPopupData} from './use-donation-popup-data';

export default function GiveBeforeOther({
    link,
    close,
    data,
    variant
}: {
    link: string;
    close: () => void;
    data: DonationPopupData;
    variant?: string;
}) {
    const {showThankYou, onThankYouClick} = useOnThankYouClick();
    const [controlLink] = useGiveLinks();

    if (showThankYou) {
        return <ThankYou link={link} close={close} source={variant} />;
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
                Go to your {lookupVariant(variant)}
            </a>
        </div>
    );
}

function lookupVariant(variant?: string) {
    if (variant === 'View online') {
        return 'book';
    }
    if (variant?.includes('resource')) {
        return 'resource';
    }
    return 'item';
}