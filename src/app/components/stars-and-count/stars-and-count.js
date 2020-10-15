import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './stars-and-count.css';

const fullStar = 'star';
const halfStar = 'star-half-alt';
const emptyStar = ['far', 'star'];

export function roundedRating(rating) {
    return Math.round(rating * 10) / 10;
}

export function Stars({stars}) {
    const starIcons = [1, 2, 3, 4, 5].map((pos) => {
        if (stars >= pos - 0.25) {
            return fullStar;
        }
        if (stars >= pos - 0.75) {
            return halfStar;
        }
        return emptyStar;
    });

    return (
        <span className="stars">
            {
                starIcons.map((icon, idx) => <FontAwesomeIcon icon={icon} key={idx} />)
            }
        </span>
    );
}

export default function StarsAndCount({rating, count=0, showNumber=false}) {
    return (
        <div className="stars-and-count">
            <Stars stars={rating} />
            {showNumber && roundedRating(rating)}
            <span>({count})</span>
        </div>
    );
}
