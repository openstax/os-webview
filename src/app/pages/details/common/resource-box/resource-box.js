import settings from 'settings';

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
                text: 'Login to unlock',
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
    const loginUrl = userStatus.userInfo && userStatus.userInfo.id ?
        `${settings.accountHref}/faculty_access/apply?r=${encodedLocation}` :
        `${settings.apiOrigin}/oxauth/login/?next=${encodedLocation}`;

    return resourceBoxPermissions({
        resourceData,
        resourceStatus,
        loginUrl
    });
};

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
};
