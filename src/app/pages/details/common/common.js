import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart} from '@fortawesome/free-solid-svg-icons/faHeart';
import useGiveToday from '~/models/give-today';
import analytics from '~/helpers/analytics';
import useDetailsContext from '../context';

export {default as Authors} from './authors';
export {default as PublicationInfo} from './publication-info';
export {default as ErrataSection, ErrataContents} from './errata';

function trackLinkClick(event) {
    analytics.sendPageEvent(
        'Microdonation book page give link',
        'open',
        event.target.href
    );
}

export function GiveLink() {
    const giveData = useGiveToday();
    const {language} = useDetailsContext();

    if (!(giveData.showLink && language === 'en')) {
        return null;
    }

    return (
        <div className="give-link">
            <a href={giveData.give_link} onClick={trackLinkClick}>{giveData.give_link_text}</a>
            <FontAwesomeIcon icon={faHeart} />
        </div>
    );
}
