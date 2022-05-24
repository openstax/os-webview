import {useState, useEffect} from 'react';
import {fetchFromCMS} from '~/helpers/controller/cms-mixin';

export default function useAdoptions(uuid) {
    const [adoptions, setAdoptions] = useState([]);

    useEffect(() => {
        if (uuid) {
            fetchFromCMS(`salesforce/renewal?account_uuid=${uuid}`).then(setAdoptions);
        }
    }, [uuid]);

    return adoptions;
}
