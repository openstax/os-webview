import React from 'react';
import {studentResourceBoxPermissions} from '../../common/resource-box/resource-box';
import ResourceBoxes from '../../common/resource-box/resource-boxes';
import useUserContext from '~/contexts/user';
import './student-resources-pane.scss';

function resourceBoxModel(resourceData, userStatus) {
    return Object.assign({
        heading: resourceData.resourceHeading,
        description: '',
        comingSoon: Boolean(resourceData.comingSoonText),
        comingSoonText: '',
        printLink: resourceData.printLink
    }, studentResourceBoxPermissions(resourceData, userStatus, 'Student resources'));
}

function StudentResourcesPane({model, userStatus}) {
    return (
        <div className="student-resources-pane">
            <ResourceBoxes models={model.bookStudentResources.map((res) => resourceBoxModel(res, userStatus))} />
        </div>
    );
}

export default function LoadUserStatusThenStudentPane({model}) {
    const {userStatus} = useUserContext();

    if (!userStatus) {
        return null;
    }
    return (
        <StudentResourcesPane model={model} userStatus={userStatus} />
    );
}
