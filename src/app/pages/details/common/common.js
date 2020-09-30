import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import useGiveToday from '~/models/give-today';

export {default as Authors} from './authors';
export {default as PublicationInfo} from './publication-info';
export {default as ErrataSection, ErrataContents} from './errata';

export function GiveLink() {
    const giveData = useGiveToday();

    if (!giveData.showLink) {
        return null;
    }

    return (
        <div className="give-link">
            <a href={giveData.give_link}>{giveData.give_link_text}</a>
            <FontAwesomeIcon icon="heart" />
        </div>
    );
}
