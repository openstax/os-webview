import {useState, useLayoutEffect} from 'react';
import cmsFetch from '~/helpers/cms-fetch';
import {camelCaseKeys} from '~/helpers/page-data-utils';

type Data = {
    id: number;
    partnerName: string;
};

function usePartnerData(id: string) {
    const [data, setData] = useState<Data>();

    useLayoutEffect(() => {
        cmsFetch(`salesforce/partners/${id}`)
            .then((d) => camelCaseKeys(d) as Data)
            .then(setData);
    }, [id]);

    return data;
}

export default function usePartnerInfo(partnerId: string) {
    const data = usePartnerData(partnerId);

    return data;
}
