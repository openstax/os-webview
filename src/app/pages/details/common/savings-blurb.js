import React from 'react';
import useSavingsDataIn from '~/helpers/savings-blurb';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHandHoldingHeart} from '@fortawesome/free-solid-svg-icons/faHandHoldingHeart';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './savings-blurb.scss';

export default function SavingsBlurb({model}) {
    const html = useSavingsDataIn(model.supportStatement, model.adoptions, model.savings);

    return (
        <div className="savings-blurb">
            <span className="book-icon">
                <FontAwesomeIcon icon={faHandHoldingHeart} />
            </span>
            <RawHTML html={html} />
        </div>
    );
}
