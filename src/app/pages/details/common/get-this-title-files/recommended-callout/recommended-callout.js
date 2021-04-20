import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import './recommended-callout.scss';

export default function RecommendedCalloutJsx({title='Recommended', blurb, onPutAway}) {
    return (
        <div className="triangle-attachment">
            <div className="container">
                <span className="callout-title">{title}</span>
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
