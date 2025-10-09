import React from 'react';
import {
    studentResourceBoxPermissions,
    type ResourceData
} from '../../common/resource-box/resource-box-utils';
import ResourceBoxes, {type ResourceModel} from '../../common/resource-box/resource-boxes';
import useUserContext, {type UserStatus} from '~/contexts/user';
import type {ContextValues} from '../../context';
import './student-resources-pane.scss';

function resourceBoxModel(
    resourceData: ResourceData,
    userStatus: UserStatus
): ResourceModel {
    return Object.assign(
        {
            heading: resourceData.resourceHeading,
            description: '',
            comingSoon: Boolean(resourceData.comingSoonText),
            comingSoonText: '',
            printLink: resourceData.printLink
        },
        studentResourceBoxPermissions(
            resourceData,
            userStatus
        )
    ) as ResourceModel;
}

function StudentResourcesPane({
    model,
    userStatus
}: {
    model: ContextValues;
    userStatus: UserStatus;
}) {
    return (
        <div className="student-resources-pane">
            <ResourceBoxes
                models={model.bookStudentResources.map((res) =>
                    resourceBoxModel(res, userStatus)
                )}
            />
        </div>
    );
}

export default function LoadUserStatusThenStudentPane({
    model
}: {
    model: ContextValues;
}) {
    const {userStatus} = useUserContext();

    if (!userStatus) {
        return null;
    }
    return <StudentResourcesPane model={model} userStatus={userStatus} />;
}
