import React, {useRef} from 'react';
import useUserContext from '~/contexts/user';
import useAdoptions from '~/models/renewals';

export default function useAdoptionMicrosurveyContent() {
    const {userModel} = useUserContext();
    const {first_name: name, uuid} = userModel || {};
    const adoptions = useAdoptions(uuid);
    const ready = adoptions.Books?.length > 0;
    const ref = useRef();

    function AdoptionContent() {
        return (
            <div className="microsurvey-content" ref={ref}>
                <h1>
                    Hi, {name}. Could you update our records
                    of which books you&apos;re using?
                    Fill out the <a href="/renewal-form?from=popup">form here</a>.
                </h1>
            </div>
        );
    }

    return [ready, AdoptionContent];
}
