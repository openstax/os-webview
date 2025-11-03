import React from 'react';
import {useLocation} from 'react-router-dom';
import useUserContext from '~/contexts/user';
import linkHelper from '~/helpers/link';
import Dropdown, {MenuItem} from '../dropdown/dropdown';
import type {WindowWithSettings} from '~/helpers/window-settings';
import {assertDefined} from '~/helpers/data';

const settings = (window as WindowWithSettings).SETTINGS;
const reqFacultyAccessLink = `${settings.accountHref}/i/signup/educator/cs_form`;
const profileLink = `${settings.accountHref}/profile`;

function AccountItem() {
    const {myOpenStaxUser} = useUserContext();
    const mosIsAvailable = !myOpenStaxUser.error;

    return (
        mosIsAvailable ?
            <MenuItem label="Account Dashboard" url="/account" /> :
            <MenuItem label="Account Profile" url={`${settings.accountHref}/profile`} />
    );
}


export default function LoginMenuWithDropdown() {
    const userModel = assertDefined(useUserContext().userModel);

    // updates logoutLink
    useLocation();
    const label = `Hi ${userModel.first_name || userModel.username}`;

    return (
        <Dropdown className="login-menu nav-menu-item rightmost dropdown" label={label} excludeWrapper>
            <AccountItem />
            {
                userModel.instructorEligible &&
                    <MenuItem label="Request instructor access" url={reqFacultyAccessLink} />
            }
            {
                userModel.incompleteSignup &&
                    <MenuItem label="Complete your profile" url={profileLink} />
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
