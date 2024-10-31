import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart} from '@fortawesome/free-solid-svg-icons/faHeart';
import useGiveToday from '~/models/give-today';
import {useIntl} from 'react-intl';

export {default as Authors} from './authors';
export {default as PublicationInfo} from './publication-info';
export {default as ErrataSection, ErrataContents} from './errata';

export function GiveLink() {
    const giveData = useGiveToday();
    const {locale} = useIntl();

    if (!(giveData.showLink && locale === 'en')) {
        return null;
    }

    return (
        <div className="give-link">
            <a href={giveData.give_link}>{giveData.give_link_text}</a>
            <FontAwesomeIcon icon={faHeart} />
        </div>
    );
}
