import React, {useContext} from 'react';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import PageContext, {PageContextProvider} from './page-context';
import UserContext, {UserContextProvider} from './user-context';
import PartnerContext from '../partner-context';
import UserReview from './user-review';
import StarsAndCount, {roundedRating} from '~/components/stars-and-count/stars-and-count';
import RatingForm from './rating-form';
import linkHelper from '~/helpers/link';
import './reviews.css';

function Bar({num, value, max}) {
    return (
        <React.Fragment>
            <span className="num">{num}</span>
            <progress max={max} value={value} />
        </React.Fragment>
    );
}

function DistributionBars() {
    const {partnerId, reviews, summary} = useContext(PartnerContext);

    const ratingsCount = reviews.reduce((a, b) => {
        if (!(b.rating in a)) {
            a[b.rating] = 0;
        }
        a[b.rating] += 1;
        return a;
    }, {});
    const total = summary.count;

    return (
        <div className="distribution-bars">
            {
                [5, 4, 3, 2, 1].map((num) =>
                    <Bar num={num} value={(ratingsCount[num]||0).toString()} max={total} key={num} />)
            }
        </div>
    );
}

function Synopsis() {
    const {partnerId, summary: {rating, count}} = useContext(PartnerContext);

    return (
        <div className="review-synopsis">
            {
                count === 0 ?
                    <h2>No ratings yet</h2> :
                    <React.Fragment>
                        <h2>User Reviews</h2>
                        <div className="giant-number">{roundedRating(rating)}</div>
                        <StarsAndCount rating={rating} count={count} />
                    </React.Fragment>
            }
        </div>
    );
}

function LeaveAReview() {
    const togglePage = useContext(PageContext);

    return (
        <div className="leave-a-review">
            <div>Leave a review for this product</div>
            <button type="button" className="primary" onClick={togglePage}>
                Write a review
            </button>
        </div>
    );
}

function LoginToReview() {
    return (
        <div className="leave-a-review">
            <div>Sign in to leave a review</div>
            <a href={linkHelper.loginLink()} className="btn primary">Login</a>
        </div>
    );
}

function YouLeftAReview({status, updated}) {
    return (
        <div className="leave-a-review">
            <div>You submitted a review for this resource on <b>{updated}</b>.</div>
            {
                status !== 'Approved' &&
                    <span>
                        The status of your submission is{' '}
                        <b className="review-status">{status}</b>.
                        An email will be sent when your review has been processed.
                    </span>
            }
        </div>
    );
}

function ReviewPrompt({accountId, hasWrittenReview, status, updated}) {
    if (!accountId) {
        return (<LoginToReview />);
    }
    if (!hasWrittenReview) {
        return (<LeaveAReview />);
    }
    return (
        <YouLeftAReview status={status} updated={updated} />
    );
}

function ReviewsPage() {
    const {accountId} = useContext(UserContext);
    const {partnerId, reviews} = useContext(PartnerContext);
    const reviewModels = reviews
        .map((r) => ({
            initials: r.submittedByName.replace(/[^A-Z]/g, '').substr(0, 2),
            userName: r.submittedByName,
            rating: r.rating,
            review: r.review,
            allowEdit: r.submittedByAccountId === accountId,
            updated: new Date(`${r.created}T00:00:00`).toLocaleDateString('en-us'),
            response: r.partnerResponse,
            status: r.status
        }))
        .filter((r) => r.review.length > 0 || r.allowEdit)
        .sort((a, b) => new Date(b.updated) - new Date(a.updated));
    const indexOfUserReview = reviewModels.findIndex((r) => r.allowEdit);
    const notLoggedIn = !accountId;

    if (indexOfUserReview > -1) {
        const [userReview] = reviewModels.splice(indexOfUserReview, 1);

        userReview.allowEdit = true;
        reviewModels.unshift(userReview);
    }
    const yourReviewModel = reviewModels[0] || {};

    return (
        <div className="reviews">
            <Synopsis />
            <DistributionBars />
            <ReviewPrompt
                accountId={accountId}
                hasWrittenReview={indexOfUserReview >= 0}
                status={yourReviewModel.status}
                updated={yourReviewModel.updated}
            />
            <div className="review-list">
                {reviewModels.map((model) => <UserReview {...model} key={model.id} />)}
            </div>
        </div>
    );
}

// eslint-disable-next-line complexity
export default function Reviews({partnerId}) {
    const [showUpdateForm, togglePage] = useToggle(false);

    return (
        <PageContextProvider togglePage={togglePage} partnerId={partnerId}>
            <UserContextProvider>
                {showUpdateForm ? <RatingForm /> : <ReviewsPage />}
            </UserContextProvider>
        </PageContextProvider>
    );
}
