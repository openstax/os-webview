import React, {useState, useContext, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PageContext from './page-context';
import UserContext from './user-context';
import PartnerContext from '../partner-context';
import {RawHTML, useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './rating-form.css';

const nameInfo = 'Your name as it is displayed here will be shown publicly when you leave a rating.';

function Star({starValue, full, setRating}) {
    const imgUrl = full ? '/images/partners/full-star.svg' : '/images/partners/empty-star.svg';

    function saveRating() {
        setRating(starValue);
    }

    return (
        <span role="button" onClick={saveRating}>
            <img src={imgUrl} />
        </span>
    );
}

const translations = [
    'unrated',
    'Terrible resource',
    'Poor resource',
    'Decent resource',
    'Good resource',
    'Great resource'
];

function Stars({rating, setRating}) {
    return (
        <div className="star-selector">
            <span className="stars">
                {
                    [1, 2, 3, 4, 5].map((starValue) => {
                        const full = rating >= starValue;

                        return (
                            <Star {...{starValue, full, rating, setRating}} key={starValue} />
                        );
                    })
                }
            </span>
            {translations[rating]}
        </div>
    );
}

export function useMyReview() {
    const {reviews} = useContext(PartnerContext);
    const {accountId} = useContext(UserContext);
    const myReview = reviews.find((r) => r.submittedByAccountId === accountId);

    return myReview;
}

function useRating() {
    const myReview = useMyReview();
    const [rating, setRating] = useState(myReview ? myReview.rating : 0);

    return [rating, setRating, myReview];
}

function InfoButton({info}) {
    const [hovering, toggle] = useToggle(false);

    return (
        <div
            className="info-button with-tooltip"
            onClick={() => toggle()}
            onMouseLeave={() => toggle(false)}
        >
            <FontAwesomeIcon icon="info-circle" />
            <RawHTML className="tooltip" html={info} hidden={!hovering} />
        </div>
    );
}

export default function RatingForm() {
    const togglePage = useContext(PageContext);
    const {accountId, userName} = useContext(UserContext);
    const {postRating, partnerId} = useContext(PartnerContext);
    const [rating, setRating, myReview] = useRating();
    const textAreaRef = useRef();
    const guidelinesLink = `
        <a href="/general/tech-scout-review-standards-and-language" target="_blank">
        our guidelines</a>
    `;
    const [heading, instructions, buttonText] = myReview ?
        [
            'Update your rating or review',
            `Select a new rating or update your review below. Updated ratings and
            reviews will replace your current rating and review. If you make any
            changes to your written review, you will have to resubmit it for approval.
            Please be sure that your review follows ${guidelinesLink}.`,
            'Update'
        ] :
        [
            'Rate this resource',
            `Written reviews will be submitted for approval before they are posted.
            You will receive an email notifying you of your review status. Please
            be sure that your review follows ${guidelinesLink}.`,
            'Publish'
        ];
    const requiredMessage = rating ? '' : 'Rating is required';

    function postReview(event) {
        const commonPayload = {
            partner: partnerId,
            review: textAreaRef.current.value,
            rating
        };
        const [payload, method] = myReview ?
            [
                {
                    id: myReview.id,
                    ...commonPayload
                },
                'PATCH'] :
            [
                {
                    submitted_by_name: userName, // eslint-disable-line camelcase
                    submitted_by_account_id: accountId, // eslint-disable-line camelcase
                    ...commonPayload
                },
                'POST'
            ];

        postRating(payload, method).then(togglePage);
        event.preventDefault();
    }

    return (
        <div className="rating-form">
            <div>
                <span className="back-button" role="button" onClick={() => togglePage()}>
                    <FontAwesomeIcon icon="arrow-left" />
                </span>
                <h1>{heading}</h1>
            </div>
            <div className="text-content">
                <div className="user-name">{userName}</div>
                <div>
                    Posting is public
                    <InfoButton info={nameInfo} />
                </div>
                <Stars {...{rating, setRating}} />
                <div className="review-form">
                    <RawHTML html={instructions} />
                    <textarea
                        name="review" ref={textAreaRef}
                        placeholder="Please tell us about your experience (optional)"
                    >
                        {myReview && myReview.review}
                    </textarea>
                </div>
                <div className="button-row">
                    <span className="required-message">
                        {requiredMessage}
                    </span>
                    <button type="button" onClick={() => togglePage()}>Cancel</button>
                    <button
                        type="submit" className="primary" onClick={postReview}
                        disabled={!rating}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
