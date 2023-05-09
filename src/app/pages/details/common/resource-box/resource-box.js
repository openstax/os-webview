import React from 'react';
import {FormattedMessage} from 'react-intl';
import linkHelper from '~/helpers/link';
import {useDataFromSlug, camelCaseKeys} from '~/helpers/page-data-utils';
import useUserContext from '~/contexts/user';

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
                url: resourceData.linkExternal || resourceData.linkDocumentUrl ||
                    resourceData.linkDocument?.file
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

const emptyResources = {
    bookVideoFacultyResources: [],
    bookFacultyResources: []
};

export function useResources(slug) {
    const {isVerified} = useUserContext();
    const title = slug.replace('books/', '');
    const rawResources = useDataFromSlug(
        `books/resources/?slug=${title}&x=${isVerified ? 'x' : 'y'}`
    );
    const resources = React.useMemo(
        () => rawResources?.error ? null : camelCaseKeys(rawResources),
        [rawResources]
    );

    return resources || emptyResources;
}

export function resourceBoxModel(resourceData, userStatus, bookModel) {
    return Object.assign(
        {
            id: resourceData.resource.id,
            heading: resourceData.resource.heading,
            description: resourceData.resource.description,
            creatorFest: resourceData.resource.creatorFestResource,
            comingSoon: Boolean(resourceData.comingSoonText),
            comingSoonText: resourceData.comingSoonText,
            k12: resourceData.k12,
            videoReferenceNumber: resourceData.videoReferenceNumber,
            trackResource: Boolean(userStatus.isInstructor) &&
                {
                    book: bookModel.id,
                    // eslint-disable-next-line camelcase
                    account_id: userStatus.userInfo.accounts_id,
                    // eslint-disable-next-line camelcase
                    resource_name: resourceData.resource.heading
                },
            printLink: resourceData.printLink,
            bookModel
        },
        instructorResourceBoxPermissions(resourceData, userStatus, 'Instructor resources')
    );
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
