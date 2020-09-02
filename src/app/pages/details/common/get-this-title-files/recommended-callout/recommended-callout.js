import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './recommended-callout.css';

export default function RecommendedCalloutJsx({title='Recommended', blurb, onPutAway}) {
    return (
        <div className="triangle-attachment">
            <div className="container">
                <span className="callout-title">{title}</span>
                <button type="button" class="put-away" onClick={onPutAway}>
                    <FontAwesomeIcon icon="times" />
                </button>
                {
                    blurb && <RawHTML className="callout-blurb" html={blurb} />
                }
            </div>
        </div>
    );
}
