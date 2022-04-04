import React from 'react';
import {useDataFromSlug} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {useLocation} from 'react-router-dom';
import useUserContext from '~/contexts/user';
import linkHelper from '~/helpers/link';
import {useMyOpenStaxIsAvailable} from '~/pages/my-openstax/store/user';
import Dropdown, {MenuItem} from './dropdown/dropdown';

const settings = window.SETTINGS;
const facultySignupStep4 = `${settings.accountHref}/i/signup/educator/profile_form`;
const reqFacultyAccessLink = `${settings.accountHref}/i/signup/educator/cs_form`;

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

function TutorMenuItem() {
    const tutorPageData = useDataFromSlug('pages/openstax-tutor');

    if (!tutorPageData) {
        return null;
    }
    return (
        <MenuItem
            label="OpenStax Tutor"
            url={`${tutorPageData.tutor_login_link}/dashboard`}
        />
    );
}

function TutorMenuItemIfUser({userModel}) {
    const isTutorUser = (userModel.groups || []).includes('OpenStax Tutor');

    return isTutorUser ? <TutorMenuItem /> : null;
}

function AccountItem() {
    const mosIsAvailable = useMyOpenStaxIsAvailable();

    return (
        mosIsAvailable ?
            <MenuItem label="Account Dashboard" url="/#account" /> :
            <MenuItem label="Account Profile" url={`${settings.accountHref}/profile`} />
    );
}

// eslint-disable-next-line complexity
function LoginMenuWithDropdown() {
    const {userModel} = useUserContext();

    // updates logoutLink
    useLocation();
    const label = `Hi ${userModel.first_name || userModel.username}`;
    const incomplete = !((userModel.groups || []).includes('Student') ||
        !userModel.needs_profile_completed ||
        !userModel.is_newflow ||
        userModel.stale_verification);
    const instructorEligible = !((userModel.groups || []).includes('Faculty') ||
        (!userModel.stale_verification && userModel.pending_verification));

    return (
        <Dropdown className="login-menu nav-menu-item rightmost dropdown" label={label} excludeWrapper>
            <AccountItem />
            <TutorMenuItemIfUser userModel={userModel} />
            {incomplete && <MenuItem label="Finish signing up" url={facultySignupStep4} />}
            {
                instructorEligible &&
                    <MenuItem label="Request instructor access" url={reqFacultyAccessLink} />
            }
            <MenuItem label="Log out" url={linkHelper.logoutLink()} local="true" />
        </Dropdown>
    );
}

export default function LoginMenu() {
    const {userModel} = useUserContext();
    const loggedIn = Boolean(typeof userModel === 'object' && userModel.id);

    return (
        loggedIn ?
            <LoginMenuWithDropdown /> :
            <LoginLink />
    );
}
