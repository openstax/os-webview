import React, {useContext} from 'react';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {PageContext} from './contexts';
import useReviews from '~/models/reviews';
import UserReview from './user-review';
import {useUserModel} from '~/models/usermodel';
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
    const {partnerId, reviews, summary} = useContext(PageContext);

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
    const {partnerId, summary: {rating, count}} = useContext(PageContext);

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
    const {togglePage} = useContext(PageContext);

    return (
        <div className="leave-a-review">
            Leave a review for this product
            <button type="button" className="primary" onClick={togglePage}>
                Write a review
            </button>
        </div>
    );
}

function LoginToReview() {
    return (
        <div className="leave-a-review">
            Sign in to leave a review
            <a href={linkHelper.loginLink()} className="btn primary">Login</a>
        </div>
    );
}

function YouLeftAReview() {
    const date = '6/25/2020';
    const status = ''; // Future: reviews will have a status

    return (
        <div className="leave-a-review">
            You submitted a review for this resource on <b>{date}</b>.
            {
                status === 'PENDING' &&
                    <span>
                        The status of your submission is <b>{status}</b>.
                        An email will be sent when your review has been processed.
                    </span>
            }
        </div>
    );
}

function ReviewPrompt({accountId, hasWrittenReview}) {
    if (!accountId) {
        return (<LoginToReview />);
    }
    if (!hasWrittenReview) {
        return (<LeaveAReview />);
    }
    return null;
}

function ReviewsPage() {
    const {partnerId, reviews, accountId} = useContext(PageContext);
    const reviewModels = reviews.map((r) => ({
        initials: r.submittedByName.replace(/[^A-Z]/g, '').substr(0, 2),
        userName: r.submittedByName,
        rating: r.rating,
        review: r.review,
        id: r.submittedByAccountId,
        allowEdit: false,
        updated: new Date(`${r.updated}T00:00:00`).toLocaleDateString('en-us'),
        response: r.partnerResponse
    }));
    const indexOfUserReview = reviewModels.findIndex((r) => r.id === accountId);
    const notLoggedIn = !accountId;

    if (indexOfUserReview > -1) {
        const [userReview] = reviewModels.splice(indexOfUserReview, 1);

        userReview.allowEdit = true;
        reviewModels.unshift(userReview);
    }

    return (
        <div className="reviews">
            <Synopsis />
            <DistributionBars />
            <ReviewPrompt accountId={accountId} hasWrittenReview={indexOfUserReview >= 0} />
            <div className="review-list">
                {reviewModels.map((model) => <UserReview {...model} key={model.id} />)}
            </div>
        </div>
    );
}

// eslint-disable-next-line complexity
function usePageContext(togglePage, partnerId) {
    const [ratings, postRating] = useReviews(partnerId);
    const userModel = useUserModel();

    return {
        togglePage,
        partnerId,
        summary: ratings ? {count: ratings.ratingCount, rating: ratings.averageRating.ratingAvg} : {},
        reviews: ratings ? ratings.reviews : [],
        postRating,
        accountId: userModel && userModel.id,
        userName: userModel && userModel.last_name &&
            `${userModel.first_name} ${userModel.last_name.substr(0, 1)}.`
    };
}

// eslint-disable-next-line complexity
export default function Reviews({partnerId}) {
    const [showUpdateForm, togglePage] = useToggle(false);
    const contextValue = usePageContext(togglePage, partnerId);

    return (
        <PageContext.Provider value={contextValue}>
            {showUpdateForm ? <RatingForm /> : <ReviewsPage />}
        </PageContext.Provider>
    );
}
