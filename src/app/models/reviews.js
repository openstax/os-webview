import {useState, useLayoutEffect} from 'react';
import cmsFetch, {cmsPost} from './cmsFetch';
import $ from '~/helpers/$';

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
