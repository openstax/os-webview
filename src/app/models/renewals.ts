import {useState, useEffect} from 'react';
import {fetchFromCMS} from '~/helpers/page-data-utils';

export type Adoption = {
    Books: {
        name: string;
        students: number;
    }[];
}

export default function useAdoptions(uuid?: string) {
    const [adoptions, setAdoptions] = useState<Adoption>();

    useEffect(() => {
        if (uuid) {
            fetchFromCMS(`salesforce/renewal?account_uuid=${uuid}`).then(
                setAdoptions
            );
        }
    }, [uuid]);

    return adoptions;
}
