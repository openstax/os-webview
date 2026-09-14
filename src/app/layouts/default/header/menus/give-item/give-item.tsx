import React from 'react';
import useGiveToday from '~/models/give-today';
import headerGiveLink from '~/models/give-link';
import GiveButton from '../give-button/give-button';

export default function GiveItem() {
    const giveData = useGiveToday();

    return giveData.showButton && giveData.give_link ? (
        <GiveButton />
    ) : (
        <a
            className="give-button medium"
            target="_blank"
            rel="noopener noreferrer"
            href={headerGiveLink(giveData)}
            data-analytics-link
        >
            Give
        </a>
    );
}
