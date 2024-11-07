import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {
    studentResourceBoxPermissions,
    ResourceData
} from '../../common/resource-box/resource-box-utils';
import useUserContext, {UserStatus} from '~/contexts/user';
import useDetailsContext, {ContextValues} from '../../context';
import ResourceBoxes, {ResourceModel} from '../../common/resource-box/resource-boxes';
import './student-resource-tab.scss';

function resourceBoxModel(
    resourceData: ResourceData,
    userStatus: UserStatus,
    bookModel: ContextValues
) {
    return Object.assign(
        {
            heading: resourceData.resourceHeading,
            description: resourceData.resourceDescription,
            comingSoon: Boolean(resourceData.comingSoonText),
            comingSoonText: resourceData.comingSoonText,
            printLink: resourceData.printLink,
            bookModel,
            videoReferenceNumber: resourceData.videoReferenceNumber
        },
        studentResourceBoxPermissions(resourceData, userStatus)
    );
}

function StudentResourceTab({userStatus}: {userStatus: UserStatus}) {
    const model = useDetailsContext();
    const fss = model.freeStuffStudent.content;
    const models = model.bookStudentResources.map((resourceData) =>
        resourceBoxModel(resourceData, userStatus, model)
    );

    return (
        <div className="student-resources">
            <div className="free-stuff-blurb">
                <RawHTML Tag="h2" html={fss.heading} />
                <RawHTML html={fss.content} className="blurb-body" />
            </div>
            <div
                className="resources"
                data-analytics-content-list="Student Resources"
            >
                <ResourceBoxes models={models as ResourceModel[]} />
            </div>
        </div>
    );
}

export default function LoadUserStatusThenStudentTab() {
    const {userStatus} = useUserContext();

    if (!userStatus) {
        return null;
    }
    return <StudentResourceTab userStatus={userStatus} />;
}
