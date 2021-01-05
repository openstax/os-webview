import settings from 'settings';
import React, {useState, useEffect} from 'react';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {useUserModel} from '~/models/usermodel';
import userModelBus from '~/models/usermodel-bus';
import linkHelper from '~/helpers/link';
import Dropdown, {MenuItem} from '../dropdown/dropdown';

function useLocation() {
    const [location, setLocation] = useState(window.location.href);

    useEffect(() => {
        const updateLocation = () => {
            setLocation(window.location.href);
        };

        window.addEventListener('navigate', updateLocation);
        return () => window.removeEventListener('navigate', updateLocation);
    }, []);

    return location;
}

// Slightly hacky; avoiding adding a new item to settings,
// but probably will do so eventually
const dqMatch = settings.accountHref.match(/-[^.]+/);
const domainQualifier = dqMatch ? dqMatch[0] : '';
const tutorDomain = `https://tutor${domainQualifier}.openstax.org/dashboard`;

const facultySignupStep4 = `${settings.accountHref}/i/signup/educator/profile_form`;
const reqFacultyAccessLink = `${settings.accountHref}/i/signup/educator/cs_form`;

function LoginLink() {
    // It's not used directly, but loginLink changes when it does
    const location = useLocation();

    return (
        <li className="login-menu nav-menu-item rightmost">
            <a
                href={linkHelper.loginLink()} class="pardotTrackClick"
                data-local="true" role="menuitem"
            >
                Log in
            </a>
        </li>
    );
}

function useIsTutorUser(userModel) {
    const [isTutorUser, toggle] = useToggle((userModel.groups || []).includes('OpenStax Tutor'));
    const userPollInterval = setInterval(() => {
        if (isTutorUser) {
            clearInterval(userPollInterval);
            return;
        }
        userModelBus.get('accountsModel-load')
            .then((accountResponse) => {
                const foundTutor = accountResponse.applications
                    .find((app) => app.name === 'OpenStax Tutor');

                if (foundTutor) {
                    toggle(true);
                    clearInterval(userPollInterval);
                }
            });
    }, 60000);

    return isTutorUser;
}

// eslint-disable-next-line complexity
function LoginMenuWithDropdown({userModel}) {
    const location = useLocation(); // updates logoutLink
    const label = `Hi ${userModel.first_name || userModel.username}`;
    const isTutorUser = useIsTutorUser(userModel);
    const incomplete = !Boolean(
        (userModel.groups || []).includes('Student') ||
        !userModel.needs_profile_completed ||
        !userModel.is_newflow ||
        userModel.stale_verification
    );
    const instructorEligible = !Boolean(
        (userModel.groups || []).includes('Faculty') ||
        (!userModel.stale_verification && userModel.pending_verification)
    );

    return (
        <Dropdown className="login-menu nav-menu-item rightmost dropdown" label={label} excludeWrapper>
            <MenuItem label="Account Profile" url={`${settings.accountHref}/profile`} />
            {isTutorUser && <MenuItem label="OpenStax Tutor" url={tutorDomain} />}
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
    const userModel = useUserModel();
    const loggedIn = Boolean(typeof userModel === 'object' && userModel.id);

    useEffect(() => {
        if (userModel && userModel.id) {
            pi('identify_client', userModel.id);
        }
    }, [userModel]);

    return (
        loggedIn ?
            <LoginMenuWithDropdown userModel={userModel} /> :
            <LoginLink />
    );
}
