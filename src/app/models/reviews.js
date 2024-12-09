import {useState, useLayoutEffect, useCallback} from 'react';
import cmsFetch, {cmsPost} from '~/helpers/cms-fetch';
import {camelCaseKeys} from '~/helpers/page-data-utils';
import meanBy from 'lodash/meanBy';

const postUrl = 'salesforce/reviews/';

// Deleted ones aren't omitted on the server, and after updates, I have to
// calculate them anyway.
// Note: mutator
function recalculateRatings(data) {
    if (!data.reviews) {
        data.reviews = [];
        data.averageRating = {};
    }
    const reviewsThatCount = data.reviews.filter((r) => r.status === 'Approved');

    data.ratingCount = reviewsThatCount.length;
    data.averageRating.ratingAvg = meanBy(reviewsThatCount, (r) => r.rating);
    return data;
}

function usePartnerData(id) {
    const [data, setData] = useState();
    const update = useCallback(
        (review) => {
            const replaceIndex = data.reviews.findIndex((item) => item.id === review.id);

            if (replaceIndex >= 0) {
                data.reviews.splice(replaceIndex, 1, review);
            } else {
                data.reviews.push(review);
            }
            recalculateRatings(data);
            setData({...data});
        },
        [data]
    );

    useLayoutEffect(
        () => {
            cmsFetch(`salesforce/partners/${id}`)
                .then(camelCaseKeys)
                .then(recalculateRatings)
                .then(setData);
        },
        [id]
    );

    return [data, update];
}

export default function useReviews(partnerId) {
    const [data, updateReview] = usePartnerData(partnerId);

    async function postData(payload, method) {
        try {
            const postResult = await cmsPost(postUrl, payload, method);

            if (typeof postResult === 'string') {
                throw new Error(`Error posting review: ${postResult}`);
            } else {
                updateReview(camelCaseKeys(postResult));
            }
        } catch (e) {
            // eslint-disable-next-line no-alert
            window.alert(`Failed to ${method}: ${e}`);
        }
    }

    return [data, postData];
}
