import React from 'react';
import useSavingsDataIn, {linkClickTracker} from '~/helpers/savings-blurb';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './savings-blurb.css';

export default function SavingsBlurb({model}) {
    const html = useSavingsDataIn(model.supportStatement, model.adoptions, model.savings);
    const eventName = 'Microdonation book page impact link';

    return (
        <div className="savings-blurb" onClick={linkClickTracker(eventName)}>
            <span className="book-icon">
                <FontAwesomeIcon icon="hand-holding-heart" />
            </span>
            <RawHTML html={html} />
        </div>
    );
}
