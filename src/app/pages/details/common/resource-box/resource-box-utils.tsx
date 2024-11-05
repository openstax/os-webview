import React from 'react';
import {FormattedMessage} from 'react-intl';
import linkHelper from '~/helpers/link';
import {useDataFromSlug, camelCaseKeys} from '~/helpers/page-data-utils';
import useUserContext, {UserStatus} from '~/contexts/user';
import type {BookModel} from './resource-boxes';

type WindowWithSettings = typeof window & {
    SETTINGS: {accountHref: string};
};

const settings = (window as WindowWithSettings).SETTINGS;

function encodeLocation(search: string) {
    const pathWithoutSearch = `${window.location.origin}${window.location.pathname}`;

    return encodeURIComponent(`${pathWithoutSearch}?${search}`);
}

export type ResourceData = {
    linkExternal: string;
    linkDocumentUrl: string;
    linkDocument?: {
        file: string;
    };
    linkText: string;
    resource: {
        id: number;
        heading: string;
        resourceCategory: string;
        resourceUnlocked: boolean;
        creatorFestResource: boolean;
        description: string;
    };
    comingSoonText: string;
    videoReferenceNumber: number;
    k12: boolean;
    printLink: string;
    resourceUnlocked: boolean;
    lockedText: string;
};

function resourceBoxPermissions({
    resourceData,
    resourceStatus,
    loginUrl
}: {
    resourceData: ResourceData;
    resourceStatus: () => 'unlocked' | 'pending' | 'locked';
    loginUrl: string;
}) {
    const isExternal = Boolean(resourceData.linkExternal);
    const status = resourceStatus();
    const statusToPermissions = {
        unlocked: {
            iconType: isExternal ? 'external-link-alt' : 'download',
            link: {
                text: resourceData.linkText,
                url:
                    resourceData.linkExternal ||
                    resourceData.linkDocumentUrl ||
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
export function instructorResourceBoxPermissions(
    resourceData: ResourceData,
    userStatus: UserStatus,
    search: string
) {
    const resourceStatus = () => {
        if (
            resourceData?.resource?.resourceUnlocked ||
            userStatus.isInstructor
        ) {
            return 'unlocked';
        }
        if (userStatus.pendingVerification) {
            return 'pending';
        }
        return 'locked';
    };
    const encodedLocation = encodeLocation(search);
    const loginUrl = userStatus.userInfo?.id
        ? `${settings.accountHref}/faculty_access/apply?r=${encodedLocation}`
        : linkHelper.loginLink();

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

export function useResources(slug: string) {
    const {isVerified} = useUserContext();
    const title = slug.replace('books/', '');
    const rawResources = useDataFromSlug(
        `books/resources/?slug=${title}&x=${isVerified ? 'x' : 'y'}`
    );
    const resources = React.useMemo(
        () => (rawResources?.error ? null : camelCaseKeys(rawResources)),
        [rawResources]
    );

    return resources || emptyResources;
}

export function resourceBoxModel(
    resourceData: ResourceData,
    userStatus: UserStatus,
    bookModel: BookModel
) {
    return Object.assign(
        {
            id: resourceData.resource.id,
            heading: resourceData.resource.heading,
            resourceCategory: resourceData.resource.resourceCategory,
            description: resourceData.resource.description,
            creatorFest: resourceData.resource.creatorFestResource,
            comingSoon: Boolean(resourceData.comingSoonText),
            comingSoonText: resourceData.comingSoonText,
            k12: resourceData.k12,
            videoReferenceNumber: resourceData.videoReferenceNumber,
            trackResource: Boolean(userStatus.trackDownloads) && {
                book: bookModel.id,
                // eslint-disable-next-line camelcase
                account_id: userStatus.userInfo.accounts_id,
                // eslint-disable-next-line camelcase
                resource_name: resourceData.resource.heading
            },
            printLink: resourceData.printLink,
            bookModel
        },
        instructorResourceBoxPermissions(
            resourceData,
            userStatus,
            'Instructor resources'
        )
    );
}

// Utility function for student resources
export function studentResourceBoxPermissions(
    resourceData: ResourceData,
    userStatus: UserStatus
) {
    const resourceStatus = () => {
        if (
            resourceData.resourceUnlocked ||
            userStatus.isStudent ||
            userStatus.isInstructor
        ) {
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
