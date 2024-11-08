import React from 'react';
import useSavingsData from '~/helpers/savings-blurb';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHandHoldingHeart} from '@fortawesome/free-solid-svg-icons/faHandHoldingHeart';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './savings-blurb.scss';

export default function SavingsBlurb() {
    const html = useSavingsData();

    return (
        <div className="savings-blurb">
            <span className="book-icon">
                <FontAwesomeIcon icon={faHandHoldingHeart} />
            </span>
            <RawHTML html={html} />
        </div>
    );
}
