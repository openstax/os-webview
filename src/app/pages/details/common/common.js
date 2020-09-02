import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export {default as Authors} from './authors';
export {default as PublicationInfo} from './publication-info';
export {default as ErrataSection, ErrataContents} from './errata';

export function GiveLink({content={}}) {
    const {giveLink, giveLinkText} = content;

    if (!giveLink) {
        return null;
    }

    return (
        <div className="give-link">
            <a href={giveLink}>{giveLinkText}</a>
            <FontAwesomeIcon icon="heart" />
        </div>
    );
}
