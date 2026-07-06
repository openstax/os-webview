import React from 'react';
import useGiveToday from '~/models/give-today';
import GiveButton from '../give-button/give-button';

const GIVE_HEADER_URL =
    'https://riceconnect.rice.edu/donation/support-openstax-header';

export default function GiveItem() {
    const {showButton} = useGiveToday();

    return showButton ? (
        <GiveButton />
    ) : (
        <a
            className="give-button medium"
            target="_blank"
            rel="noopener noreferrer"
            href={GIVE_HEADER_URL}
            data-analytics-link
        >
            Give
        </a>
    );
}
