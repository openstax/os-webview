import React from 'react';
import useDetailsContext from '~/pages/details/context';

const settings = window.SETTINGS;

function encodeLocation(search) {
    const pathWithoutSearch = `${window.location.origin}${window.location.pathname}`;

    return encodeURIComponent(`${pathWithoutSearch}?${search}`);
}

const localizedText = {
    'en': 'Login to unlock',
    'es': 'Inicie sesión para desbloquear'
};

/*
    I am sorry for this hack. I needed to be able to use a hook and the chain
    of hooks became unworkable. So I made a component that returns text.
*/
function LocalizedText() {
    const {language} = useDetailsContext();

    return (
        localizedText[language]
    );
}

function resourceBoxPermissions({
    resourceData, resourceStatus, loginUrl
}) {
    const isExternal = Boolean(resourceData.linkExternal);
    const status = resourceStatus();
    const statusToPermissions = {
        unlocked: {
            iconType: isExternal ? 'external-link-alt' : 'download',
            link: {
                text: resourceData.linkText,
                url: resourceData.linkExternal || resourceData.linkDocumentUrl
            }
        },
        pending: {
            iconType: 'lock'
        },
        locked: {
            iconType: 'lock',
            link: {
                text: <LocalizedText />,
                url: loginUrl
            }
        }
    };

    return statusToPermissions[status];
}

// Utility function to set the values associated with whether the resource
// is available to the user (instructor version)
export function instructorResourceBoxPermissions(resourceData, userStatus, search) {
    const resourceStatus = () => {
        if (resourceData.resourceUnlocked || userStatus.isInstructor) {
            return 'unlocked';
        }
        if (userStatus.pendingVerification) {
            return 'pending';
        }
        return 'locked';
    };
    const encodedLocation = encodeLocation(search);
    const loginUrl = userStatus.userInfo?.id ?
        `${settings.accountHref}/faculty_access/apply?r=${encodedLocation}` :
        `${settings.apiOrigin}/oxauth/login/?next=${encodedLocation}`;

    return resourceBoxPermissions({
        resourceData,
        resourceStatus,
        loginUrl
    });
}

// Utility function for student resources
export function studentResourceBoxPermissions(resourceData, userStatus, search) {
    const resourceStatus = () => {
        if (resourceData.resourceUnlocked || userStatus.isStudent || userStatus.isInstructor) {
            return 'unlocked';
        }
        return 'locked';
    };
    const loginUrl = `${settings.apiOrigin}/oxauth/login/?next=${encodeLocation(search)}`;

    return resourceBoxPermissions({
        resourceData,
        resourceStatus,
        loginUrl
    });
}
