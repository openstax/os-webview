import React from 'react';
import {useLocation} from 'react-router-dom';
import {useDataFromSlug} from '~/helpers/page-data-utils';
import useUserContext from '~/contexts/user';
import linkHelper from '~/helpers/link';
import Dropdown, {MenuItem} from '../dropdown/dropdown';

const settings = window.SETTINGS;
const facultySignupStep4 = `${settings.accountHref}/signup/educator/profile_form`;
const reqFacultyAccessLink = `${settings.accountHref}/signup/educator/cs_form`;
const profileLink = `${settings.accountHref}/profile`;

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
    const {myOpenStaxUser} = useUserContext();
    const mosIsAvailable = !myOpenStaxUser.error;

    return (
        mosIsAvailable ?
            <MenuItem label="Account Dashboard" url="/#account" /> :
            <MenuItem label="Account Profile" url={`${settings.accountHref}/profile`} />
    );
}

// eslint-disable-next-line complexity
export default function LoginMenuWithDropdown() {
    const {userModel} = useUserContext();

    // updates logoutLink
    useLocation();
    const label = `Hi ${userModel.first_name || userModel.username}`;
    const incomplete = (
        !(userModel.groups || []).includes('Student') &&
        userModel.needsProfileCompleted &&
        userModel.is_newflow &&
        !userModel.stale_verification
    );
    const instructorEligible = !(
        (userModel.groups || []).includes('Faculty') ||
        (!userModel.stale_verification && userModel.pending_verification) ||
        userModel.pendingInstructorAccess ||
        userModel.emailUnverified
    );

    return (
        <Dropdown className="login-menu nav-menu-item rightmost dropdown" label={label} excludeWrapper>
            <AccountItem />
            <TutorMenuItemIfUser userModel={userModel} />
            {incomplete && <MenuItem label="Finish signing up" url={facultySignupStep4} />}
            {
                instructorEligible &&
                    <MenuItem label="Request instructor access" url={reqFacultyAccessLink} />
            }
            {
                userModel.pendingInstructorAccess &&
                    <MenuItem label="Pending instructor access" url={profileLink} />
            }
            {
                userModel.emailUnverified &&
                    <MenuItem label="Verify your email address" url={profileLink} />
            }
            <MenuItem label="Log out" url={linkHelper.logoutLink()} local="true" />
        </Dropdown>
    );
}
