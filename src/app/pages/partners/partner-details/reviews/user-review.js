import React from 'react';
import {Stars} from '~/components/stars-and-count/stars-and-count';
import {PageContext} from './contexts';
import {useMyReview} from './rating-form';
import './user-review.css';

function UserControls() {
    const status='pending';
    const {togglePage, postRating} = React.useContext(PageContext);
    const myReview = useMyReview();

    function onUpdate(event) {
        event.preventDefault();
        togglePage();
    }

    function onDelete(event) {
        event.preventDefault();
        postRating({id: myReview.id}, 'DELETE');
    }

    return (
        <React.Fragment>
            <span className="review-status">{status}</span>
            <a href="!delete" onClick={onDelete}>Delete</a>
            &nbsp;&bull;&nbsp;
            <a href="!update" onClick={onUpdate}>Update</a>
        </React.Fragment>
    );
}

export default function UserReview({
    initials, userName, rating, review, updated, response, allowEdit=false
}) {
    return (
        <div className="user-review">
            <span className="initials">{initials}</span>
            <span className="name">{userName}</span>
            <div className="rating-and-controls stars-and-count">
                <Stars stars={rating} />
                <span className="updated">{updated}</span>
                {allowEdit && <UserControls />}
            </div>
            {review && <div className="review">{review}</div>}
            {response && <div className="response">RESPONSE GOES HERE</div>}
        </div>
    );
}
