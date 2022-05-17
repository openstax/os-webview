import React, {useRef} from 'react';
import useUserContext from '~/contexts/user';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';

export default function useAdoptionMicrosurveyContent() {
    const {userModel} = useUserContext();
    const {first_name: name} = userModel || {};
    const [clicked, disable] = useToggle(false);
    const ready = React.useMemo(
        () => !clicked && userModel?.renewal_eligible,
        [clicked, userModel]
    );
    const ref = useRef();

    function AdoptionContent() {
        return (
            <div className="microsurvey-content" ref={ref}>
                <h1>
                    Hi, {name}. Could you update our records
                    of which books you&apos;re using?
                    Fill out the <a href="/renewal-form?from=popup" onClick={disable}>form here</a>.
                </h1>
            </div>
        );
    }

    return [ready, AdoptionContent];
}
