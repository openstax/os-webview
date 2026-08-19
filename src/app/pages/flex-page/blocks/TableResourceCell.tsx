import React from 'react';
import LeftContent from '~/pages/details/common/resource-box/left-content';
import DownloadSource from '~/pages/details/common/download-source';
import {
    resourceBoxModel,
    studentResourceBoxPermissions,
    ResourceData
} from '~/pages/details/common/resource-box/resource-box-utils';
import type {ResourceModel} from '~/pages/details/common/resource-box/resource-boxes';
import type {ContextValues} from '~/pages/details/context';
import type {UserStatus} from '~/contexts/user';
import type {VariantValue} from '~/pages/details/common/get-this-title-files/give-before-pdf/use-give-dialog';
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

function isStudentResource(resolution: ResourceRefResolution): boolean {
    return resolution.ref.resourceType.toLowerCase() === 'student';
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

    return isStudentResource(resolution)
        ? buildStudentModel(resolution.resource, userStatus, bookModel)
        : (resourceBoxModel(resolution.resource, userStatus, bookModel) as ResourceModel);
}

// Renders one resolved resource_ref marker with the exact same behavior as
// the book detail page's resource boxes: Download/external-link/"Login to
// unlock" states, the Give-before-download modal, and the trackLink call
// that posts to /salesforce/download-tracking/ (the adoption-tracking
// record) - by reusing LeftContent itself rather than approximating its
// anchor attributes/click handling by hand.
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

    const variant: VariantValue = isStudentResource(resolution)
        ? 'Student resource'
        : 'Instructor resource';

    // A div, not a span: LeftContent's logged-in-non-instructor branch is a
    // block-level div, which a span cannot legally contain.
    return (
        <div className="table-resource-link">
            <LeftContent model={model} variant={variant} downloadSource={DownloadSource.flexPage} />
        </div>
    );
}
