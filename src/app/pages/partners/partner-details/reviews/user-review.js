import React from 'react';
import {Stars} from '~/components/stars-and-count/stars-and-count';
import {PageContext} from './contexts';
import {useMyReview} from './rating-form';
import ClippedText from '~/components/clipped-text/clipped-text';
import './user-review.css';

function UserControls({status}) {
    const {togglePage, postRating} = React.useContext(PageContext);
    const myReview = useMyReview();
    const displayStatus = status === 'Rejected' ? status : 'pending';

    function onUpdate(event) {
        event.preventDefault();
        togglePage();
    }

    function onDelete(event) {
        event.preventDefault();
        // eslint-disable-next-line no-alert
        if (window.confirm('Are you sure you want to delete this review?')) {
            postRating({id: myReview.id}, 'DELETE');
        }
    }

    return (
        <React.Fragment>
            {status !== 'Approved' && <span className="review-status">{displayStatus}</span>}
            <div className="user-controls">
                <a href="!delete" onClick={onDelete}>Delete</a>
                &nbsp;&bull;&nbsp;
                <a href="!update" onClick={onUpdate}>Update</a>
            </div>
        </React.Fragment>
    );
}

function ReviewAndResponse({review, response}) {
    const {partnerName} = React.useContext(PageContext);

    return (
        <React.Fragment>
            <ClippedText className="review">{review}</ClippedText>
            {
                response &&
                    <div className="response">
                        <div className="partner-name">{partnerName}</div>
                        <ClippedText>
                            {response}
                        </ClippedText>
                    </div>
            }
        </React.Fragment>
    );
}

export default function UserReview({
    initials, userName, rating, review, updated, response, status, allowEdit=false
}) {
    const showTheReview = review && (status === 'Approved' || allowEdit);

    return (
        <div className="user-review">
            <span className="initials">{initials}</span>
            <span className="name">{userName}</span>
            <div className="rating-and-controls stars-and-count">
                <Stars stars={rating} />
                <span className="updated">{updated}</span>
                {allowEdit && <UserControls status={status} />}
            </div>
            {showTheReview && <ReviewAndResponse review={review} response={response} />}
        </div>
    );
}
