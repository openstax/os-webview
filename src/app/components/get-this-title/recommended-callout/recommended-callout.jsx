import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default function ({title='Recommended', blurb, onPutAway}) {
    return (
        <div className="triangle-attachment">
            <div className="container">
                <span className="callout-title">{title}</span>
                <button type="button" class="put-away" onClick={onPutAway}>
                    <FontAwesomeIcon icon="times" />
                </button>
                {
                    blurb && <div className="callout-blurb" dangerouslySetInnerHTML={{__html: blurb}} />
                }
            </div>
        </div>
    );
}
