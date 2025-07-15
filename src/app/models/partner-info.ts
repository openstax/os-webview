import {useState, useLayoutEffect} from 'react';
import cmsFetch from '~/helpers/cms-fetch';
import {camelCaseKeys} from '~/helpers/page-data-utils';

type Data = {
    id: number;
    partnerName: string;
    partnerType: string;
    partnerDescription: string;
    shortPartnerDescription: string;
};

function usePartnerData(id: number) {
    const [data, setData] = useState<Data>();

    useLayoutEffect(() => {
        cmsFetch(`salesforce/partners/${id}`)
            .then((d) => camelCaseKeys(d) as Data)
            .then(setData);
    }, [id]);

    return data;
}

export default function usePartnerInfo(partnerId: number) {
    const data = usePartnerData(partnerId);

    return data;
}
