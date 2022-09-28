import React, {useRef} from 'react';
import useUserContext from '~/contexts/user';
import {useLocation} from 'react-router-dom';
import {useToggle} from '~/helpers/data';
import cookie from '~/helpers/cookie';

const DISMISSED_KEY = 'renewal_dialog_dismissed';
const YESTERDAY = Date.now() - 60 * 60 * 24 * 1000;

function useCookieKey(key) {
    return React.useReducer(
        (_, value) => {
            cookie.setKey(key, value);
            return value ? value : '0';
        },
        cookie.hash[key]
    );
}

export default function useAdoptionMicrosurveyContent() {
    const {userModel} = useUserContext();
    const {first_name: name} = userModel || {};
    const [cookieValue, setCookieValue] = useCookieKey(DISMISSED_KEY);
    const recentlyDismissed = React.useMemo(
        () => +Number(cookieValue) > YESTERDAY,
        [cookieValue]
    );
    const [clicked, disable] = useToggle(recentlyDismissed);
    const ready = React.useMemo(
        () => !clicked && userModel?.renewal_eligible,
        [clicked, userModel]
    );
    const ref = useRef();
    const {pathname} = useLocation();

    // Dismiss upon navigation
    React.useEffect(
        () => {
            if (!clicked && pathname === '/renewal-form') {
                disable();
            }
        },
        [pathname, clicked, disable]
    );

    // On dismiss, write cookie entry
    React.useEffect(
        () => {
            if (!recentlyDismissed && clicked) {
                setCookieValue(Date.now().toString());
            }
        },
        [clicked, recentlyDismissed, setCookieValue]
    );

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
