import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {useIntl} from 'react-intl';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import './recommended-callout.scss';

export default function RecommendedCallout({title, blurb, onPutAway}) {
    const intl = useIntl();
    const titleToUse = title || intl.formatMessage({id: 'recommended'});

    return (
        <div className="triangle-attachment">
            <div className="container">
                <span className="callout-title">{titleToUse}</span>
                <button type="button" className="put-away" onClick={onPutAway} aria-label="close-popup">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                {
                    blurb && <RawHTML className="callout-blurb" html={blurb} />
                }
            </div>
        </div>
    );
}
