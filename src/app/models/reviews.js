import {useState, useLayoutEffect} from 'react';
import cmsFetch, {cmsPost} from './cmsFetch';
import $ from '~/helpers/$';
import meanBy from 'lodash/meanBy';

const postUrl = 'salesforce/reviews/';

function usePartnerData(id) {
    const [data, setData] = useState();

    function refresh() {
        cmsFetch(`salesforce/partners/${id}`)
            .then($.camelCaseKeys)
            .then(setData);
    }

    function update(review) {
        const newData = {...data};
        const replaceIndex = data.reviews.findIndex((item) => item.id === review.id);

        if (replaceIndex >= 0) {
            newData.reviews.splice(replaceIndex, 1, review);
        } else {
            newData.reviews.push(review);
        }
        // Properly, would refesh to get these, but there's a lag in calculating
        // them on the server and it's pretty easy to do here.
        newData.ratingCount = newData.reviews.length;
        newData.averageRating.ratingAvg = meanBy(newData.reviews, (r) => r.rating);
        setData(newData);
    }

    useLayoutEffect(refresh, [id]);
    return [data, update];
}

export default function useReviews(partnerId) {
    const [data, updateReview] = usePartnerData(partnerId);

    async function postData(payload, method) {
        try {
            const postResult = await cmsPost(postUrl, payload, method);

            updateReview($.camelCaseKeys(postResult));
        } catch (e) {
            console.warn(method, 'failed:', e);
        }
    }

    return [data, postData];
}
