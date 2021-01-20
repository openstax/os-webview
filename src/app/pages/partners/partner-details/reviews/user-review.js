import React, {useContext} from 'react';
import {Stars} from '~/components/stars-and-count/stars-and-count';
import PageContext from './page-context';
import PartnerContext from '../partner-context';
import {useMyReview} from './rating-form';
import ClippedText from '~/components/clipped-text/clipped-text';
import './user-review.css';

function UserControls({status}) {
    const togglePage = useContext(PageContext);
    const {postRating} = useContext(PartnerContext);
    const myReview = useMyReview();
    const displayStatus = ['Deleted', 'Rejected'].includes(status) ? status : 'pending';

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
                {
                    status !== 'Deleted' &&
                        <React.Fragment>
                            <a href="!delete" onClick={onDelete}>Delete</a>
                            &nbsp;&bull;&nbsp;
                        </React.Fragment>
                }
                <a href="!update" onClick={onUpdate}>Update</a>
            </div>
        </React.Fragment>
    );
}

function ReviewAndResponse({review, response}) {
    const {partnerName} = useContext(PartnerContext);

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
    const showTheReview = allowEdit || (review && status === 'Approved');

    if (!showTheReview) {
        return null;
    }

    return (
        <div className="user-review">
            <span className="initials">{initials}</span>
            <span className="name">{userName}</span>
            <div className="rating-and-controls stars-and-count">
                <Stars stars={rating} />
                <span className="updated">{updated}</span>
                {allowEdit && <UserControls status={status} />}
            </div>
            <ReviewAndResponse review={review} response={response} />
        </div>
    );
}
