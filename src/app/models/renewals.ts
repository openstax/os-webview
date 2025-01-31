import {useState, useEffect} from 'react';
import {fetchFromCMS} from '~/helpers/page-data-utils';

export default function useAdoptions(uuid: string) {
    const [adoptions, setAdoptions] = useState([]);

    useEffect(() => {
        if (uuid) {
            fetchFromCMS(`salesforce/renewal?account_uuid=${uuid}`).then(setAdoptions);
        }
    }, [uuid]);

    return adoptions;
}
