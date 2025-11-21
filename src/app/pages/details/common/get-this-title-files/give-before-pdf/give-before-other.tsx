import React from 'react';
import ThankYou, {useOnThankYouClick} from './thank-you-form';
import useGiveLinks from './use-give-links';
import CommonElements from './common-elements';
import type {DonationPopupData} from './use-donation-popup-data';

export default function GiveBeforeOther({
    link,
    close,
    data,
    track,
    variant,
    onDownload,
    id
}: {
    link: string;
    close: () => void;
    data: DonationPopupData;
    track?: string;
    variant: string;
    onDownload?: React.MouseEventHandler;
    id?: string;
}) {
    const {showThankYou, onThankYouClick} = useOnThankYouClick();
    const [controlLink] = useGiveLinks();
    const beforeOpen = React.useCallback(
        (e: React.MouseEvent) => {
            close();
            if (onDownload) {
                onDownload(e);
            }
        },
        [close, onDownload]
    );

    if (showThankYou) {
        return (
            <ThankYou
                link={link}
                close={close}
                source={variant}
                itemType={lookupVariant(variant)}
                track={track}
                id={id}
            />
        );
    }

    return (
        <div
            className='give-before-pdf'
            data-analytics-view
            data-analytics-nudge='donate'
            data-nudge-placement={variant}
        >
            <CommonElements
                data={data}
                onThankYouClick={onThankYouClick}
                giveLink={controlLink}
            />
            <a
                href={link}
                onClick={beforeOpen}
                className='btn go-to'
                {...(track ? {'data-track': track} : {})}
                data-variant={lookupVariant(variant)}
                data-local="true"
            >
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
