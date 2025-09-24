import React from 'react';
import useGiveToday from '~/models/give-today';
import './give-button.scss';

export default function GiveButton() {
    const giveData = useGiveToday();

    if (!giveData.showButton) {
        return null;
    }

    return (
        <a href={giveData.give_link} className="give-button medium" data-analytics-link>Give</a>
    );
}
