import {useState, useLayoutEffect} from 'react';
import cmsFetch, {cmsPost} from './cmsFetch';
import $ from '~/helpers/$';
import meanBy from 'lodash/meanBy';

const postUrl = 'salesforce/reviews/';

// Deleted ones aren't omitted on the server, and after updates, I have to
// calculate them anyway.
// Note: mutator
function recalculateRatings(data) {
    const reviewsThatCount = data.reviews.filter((r) => r.status !== 'Deleted');

    data.ratingCount = reviewsThatCount.length;
    data.averageRating.ratingAvg = meanBy(reviewsThatCount, (r) => r.rating);
    return data;
}

function usePartnerData(id) {
    const [data, setData] = useState();

    function refresh() {
        cmsFetch(`salesforce/partners/${id}`)
            .then($.camelCaseKeys)
            .then(recalculateRatings)
            .then(setData);
    }

    function update(review) {
        const replaceIndex = data.reviews.findIndex((item) => item.id === review.id);

        if (replaceIndex >= 0) {
            data.reviews.splice(replaceIndex, 1, review);
        } else {
            data.reviews.push(review);
        }
        recalculateRatings(data);
        setData({...data});
    }

    useLayoutEffect(refresh, [id]);
    return [data, update];
}

export default function useReviews(partnerId) {
    const [data, updateReview] = usePartnerData(partnerId);

    async function postData(payload, method) {
        try {
            const postResult = await cmsPost(postUrl, payload, method);

            if (typeof postResult === 'string') {
                throw postResult;
            } else {
                updateReview($.camelCaseKeys(postResult));
            }
        } catch (e) {
            // eslint-disable-next-line no-alert
            alert(`Failed to ${method}: ${e}`);
        }
    }

    return [data, postData];
}
