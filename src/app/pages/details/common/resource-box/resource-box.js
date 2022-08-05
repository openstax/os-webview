import React from 'react';
import {FormattedMessage} from 'react-intl';
import linkHelper from '~/helpers/link';

const settings = window.SETTINGS;

function encodeLocation(search) {
    const pathWithoutSearch = `${window.location.origin}${window.location.pathname}`;

    return encodeURIComponent(`${pathWithoutSearch}?${search}`);
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
                text: <FormattedMessage id="resources.loginToUnlock" />,
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
        linkHelper.loginLink();

    return resourceBoxPermissions({
        resourceData,
        resourceStatus,
        loginUrl
    });
}

// Utility function for student resources
export function studentResourceBoxPermissions(resourceData, userStatus) {
    const resourceStatus = () => {
        if (resourceData.resourceUnlocked || userStatus.isStudent || userStatus.isInstructor) {
            return 'unlocked';
        }
        return 'locked';
    };

    return resourceBoxPermissions({
        resourceData,
        resourceStatus,
        loginUrl: linkHelper.loginLink()
    });
}
