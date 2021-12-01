import React from 'react';
import usePageContext, {PageContextProvider} from './page-context';
import useUserContext from '~/contexts/user';
import usePartnerContext from '../partner-context';
import UserReview from './user-review';
import StarsAndCount, {roundedRating} from '~/components/stars-and-count/stars-and-count';
import RatingForm from './rating-form';
import linkHelper from '~/helpers/link';
import './reviews.scss';

function Bar({num, value, max}) {
    return (
        <React.Fragment>
            <span className="num">{num}</span>
            <progress max={max} value={value} />
        </React.Fragment>
    );
}

function DistributionBars() {
    const {reviews, summary} = usePartnerContext();

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
    const {summary: {rating, count}, reviewCount} = usePartnerContext();

    return (
        <div className="review-synopsis">
            {
                count === 0 ?
                    <h2>No ratings yet</h2> :
                    <React.Fragment>
                        <h2>User Reviews</h2>
                        <div className="giant-number">{roundedRating(rating)}</div>
                        <StarsAndCount rating={rating} count={reviewCount} />
                    </React.Fragment>
            }
        </div>
    );
}

function LeaveAReview() {
    const {togglePage} = usePageContext();

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

function ReviewPrompt({uuid, hasWrittenReview, status, updated}) {
    if (!uuid) {
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
    const {uuid} = useUserContext();
    const {reviews} = usePartnerContext();
    const reviewModels = reviews
        .map((r) => ({
            initials: r.submittedByName.replace(/[^A-Z]/g, '').substr(0, 2),
            userName: r.submittedByName,
            rating: r.rating,
            review: r.review || '',
            allowEdit: r.submittedByAccountUUID === uuid,
            updated: new Date(`${r.created}T00:00:00`).toLocaleDateString('en-us'),
            response: r.partnerResponse,
            userFacultyStatus: r.userFacultyStatus,
            status: r.status
        }))
        .filter((r) => r.review.length > 0 || r.allowEdit)
        .sort((a, b) => new Date(b.updated) - new Date(a.updated));
    const indexOfUserReview = reviewModels.findIndex((r) => r.allowEdit);

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
                uuid={uuid}
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

function PageOrForm() {
    const {showUpdateForm} = usePageContext();

    return showUpdateForm ? <RatingForm /> : <ReviewsPage />;
}

// eslint-disable-next-line complexity
export default function Reviews() {
    return (
        <PageContextProvider>
            <PageOrForm />
        </PageContextProvider>
    );
}
