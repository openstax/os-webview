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

    useLayoutEffect(refresh, [id]);
    return [data, refresh];
}

export default function useReviews(partnerId) {
    const [data, refresh] = usePartnerData(partnerId);

    async function postData(payload, method) {
        const postResult = await cmsPost(postUrl, payload, method);

        refresh();
    }

    return [data, postData];
}
