import React from 'react';
import LeftContent from '~/pages/details/common/resource-box/left-content';
import {
    resourceBoxModel,
    studentResourceBoxPermissions,
    ResourceData
} from '~/pages/details/common/resource-box/resource-box-utils';
import type {ResourceModel} from '~/pages/details/common/resource-box/resource-boxes';
import type {ContextValues} from '~/pages/details/context';
import type {UserStatus} from '~/contexts/user';
import type {ResourceRefResolution} from './table-resource-links-utils';

// student-resource-tab.tsx builds an equivalent model with a private,
// unexported local function (also named resourceBoxModel there) - it isn't
// reusable from here, so this is a deliberate, small duplication of its
// shape (heading/description read from the flat resourceHeading/
// resourceDescription fields, permissions from studentResourceBoxPermissions
// rather than the instructor one).
function buildStudentModel(
    resource: ResourceData,
    userStatus: UserStatus,
    bookModel: ContextValues
): ResourceModel {
    return Object.assign(
        {
            heading: resource.resourceHeading,
            description: resource.resourceDescription,
            comingSoon: Boolean(resource.comingSoonText),
            comingSoonText: resource.comingSoonText,
            printLink: resource.printLink,
            bookModel,
            videoReferenceNumber: resource.videoReferenceNumber
        },
        studentResourceBoxPermissions(resource, userStatus)
    ) as ResourceModel;
}

function buildModel(resolution: ResourceRefResolution, userStatus: UserStatus): ResourceModel | null {
    if (resolution.status !== 'resolved' || !resolution.resource || resolution.bookId === undefined) {
        return null;
    }

    // LeftContent/LeftButton only ever read `bookModel.id` (for trackLink) out
    // of this - a real ContextValues (the whole book detail page's data)
    // doesn't exist here, since a table cell can reference any book from any
    // flex page, not just the book whose detail page happens to be open.
    const bookModel = {id: resolution.bookId} as ContextValues;

    return resolution.ref.resource_type.toLowerCase() === 'student'
        ? buildStudentModel(resolution.resource, userStatus, bookModel)
        : (resourceBoxModel(resolution.resource, userStatus, bookModel) as ResourceModel);
}

// Renders one resolved resource_ref marker with the exact same behavior as
// the book detail page's resource boxes: Download/external-link/"Login to
// unlock" states, the Give-before-download modal, and the trackLink call
// that posts to /salesforce/download-tracking/ (the adoption-tracking
// record) - by reusing LeftContent itself rather than approximating its
// anchor attributes/click handling by hand. Not wired into the table
// renderer yet (see block-map.ts) - this is the unit that will be, once
// flex-page-renderer exposes a per-cell render slot.
export function TableResourceCell({
    resolution,
    userStatus
}: {
    resolution: ResourceRefResolution;
    userStatus: UserStatus;
}): React.ReactElement | null {
    const model = buildModel(resolution, userStatus);

    if (!model) {
        return null;
    }

    return <LeftContent model={model} />;
}
