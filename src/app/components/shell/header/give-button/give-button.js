import React from 'react';
import useGiveToday from '~/models/give-today';
import analytics from '~/helpers/analytics';
import './give-button.css';

function trackClick(event) {
    analytics.sendPageEvent('Microdonation nav give button', 'open', event.target.href);
}

export default function GiveButton() {
    const giveData = useGiveToday();

    if (!giveData.showButton) {
        return null;
    }

    return (
        <a href={giveData.give_link} className="give-button medium" onClick={trackClick}>Give</a>
    );
}
