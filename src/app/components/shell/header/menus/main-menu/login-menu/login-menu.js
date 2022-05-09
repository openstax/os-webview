import React from 'react';
import JITLoad from '~/helpers/jit-load';
import {useLocation} from 'react-router-dom';
import useUserContext from '~/contexts/user';
import linkHelper from '~/helpers/link';

function LoginLink() {
    // It's not used directly, but loginLink changes when it does
    useLocation();
    const addressHinkyQAIssue = React.useCallback(
        (e) => {
            if (e.defaultPrevented) {
                e.defaultPrevented = false;
            }
        },
        []
    );

    return (
        <li className="login-menu nav-menu-item rightmost" role="presentation">
            <a
                href={linkHelper.loginLink()} className="pardotTrackClick"
                data-local="true" role="menuitem" onClick={addressHinkyQAIssue}
            >
                Log in
            </a>
        </li>
    );
}

export default function LoginMenu() {
    const {userModel} = useUserContext();
    const loggedIn = Boolean(typeof userModel === 'object' && userModel.id);

    return (
        loggedIn ?
            <JITLoad importFn={() => import('./login-menu-with-dropdown')} /> :
            <LoginLink />
    );
}
