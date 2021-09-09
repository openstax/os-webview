import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import useDetailsContext from '~/pages/details/context';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import './recommended-callout.scss';

const localizedText = {
    'en': 'Recommended',
    'es': 'Recomendado'
};

export default function RecommendedCallout({title, blurb, onPutAway}) {
    const {language} = useDetailsContext();
    const titleToUse = title || localizedText[language];

    return (
        <div className="triangle-attachment">
            <div className="container">
                <span className="callout-title">{titleToUse}</span>
                <button type="button" className="put-away" onClick={onPutAway}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                {
                    blurb && <RawHTML className="callout-blurb" html={blurb} />
                }
            </div>
        </div>
    );
}
