import React from 'react';
import useUserContext from '~/contexts/user';
import {useLocation} from 'react-router-dom';
import cookie from '~/helpers/cookie';

const DISMISSED_KEY = 'renewal_dialog_dismissed';
// const YESTERDAY = Date.now() - 60 * 60 * 24 * 1000;

function useCookieKey(key) {
    return React.useReducer(
        (_, value) => {
            cookie.setKey(key, value);
            return value ? value : '0';
        },
        cookie.hash[key]
    );
}

function useDismissalCookie() {
    const [cookieValue, setCookieValue] = useCookieKey(DISMISSED_KEY);
    const clicked = React.useMemo(
        () => +Number(cookieValue) > 0,
        [cookieValue]
    );
    const {userModel} = useUserContext();
    const isFaculty = userModel?.accountsModel?.faculty_status === 'confirmed_faculty';
    const isAdopter = userModel?.accountsModel?.using_openstax;
    const {pathname} = useLocation();
    const ready = React.useMemo(
        () => {
            if (pathname === '/renewal-form') {
                return false;
            }
            return !clicked && isFaculty && isAdopter;
        },
        [clicked, isFaculty, isAdopter, pathname]
    );
    const disable = React.useCallback(
        () => setCookieValue(Date.now().toString()),
        [setCookieValue]
    );

    // Dismiss upon navigation
    React.useEffect(
        () => {
            window.setTimeout(
                () => {
                    if (!clicked && pathname === '/renewal-form') {
                        disable();
                    }
                },
                10
            );
        },
        [pathname, disable, clicked]
    );

    return [ready, disable];
}

function AdoptionContentBase({children, disable}) {
    const {userModel} = useUserContext();
    const {first_name: name} = userModel || {};
    const {pathname} = useLocation();
    const href = `${window.location.origin}${pathname}`;
    const renewalFormHref = `/renewal-form?from=popup&returnTo=${encodeURIComponent(href)}`;

    return (
        <div
          className="microsurvey-content"
          data-analytics-view
          data-analytics-nudge="adoption"
          data-nudge-placement="popup"
        >
            {children}
            <h1>
                Hi, {name}! Are you still using OpenStax in your course(s)?
                Please take 1 minute to tell us by filling out{' '}
                <a
                    href={renewalFormHref}
                    onClick={() => disable()}
                    data-nudge-action="interacted"
                >this form</a>.
            </h1>
        </div>
    );
}

export default function useAdoptionMicrosurveyContent() {
    const [ready, disable] = useDismissalCookie();
    const AdoptionContent = React.useCallback(
        ({children}) => (
            <AdoptionContentBase disable={disable}>
                {children}
            </AdoptionContentBase>
        ),
        [disable]
    );

    return [ready, AdoptionContent];
}
