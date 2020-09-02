import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {studentResourceBoxPermissions} from '../../common/resource-box/resource-box';
import {useUserStatus} from '../../common/hooks';
import ResourceBoxes from '../../common/resource-box/resource-boxes';
import './student-resource-tab.css';

function resourceBoxModel(resourceData, userStatus, search) {
    return Object.assign({
        heading: resourceData.resourceHeading,
        description: resourceData.resourceDescription,
        comingSoon: Boolean(resourceData.comingSoonText),
        comingSoonText: resourceData.comingSoonText,
        printLink: resourceData.printLink
    }, studentResourceBoxPermissions(resourceData, userStatus, 'Student resources'));
}

function StudentResourceTab({model, userStatus}) {
    const fss = model.freeStuffStudent.content;
    const models = model.bookStudentResources.map((resourceData) =>
        resourceBoxModel(resourceData, userStatus, 'Student resources')
    );

    return (
        <div className="student-resources">
            <div className="free-stuff-blurb">
                <RawHTML Tag="h2" html={fss.heading} />
                <RawHTML html={fss.content} className="blurb-body" />
            </div>
            <div className="resources">
                <ResourceBoxes models={models} />
            </div>
        </div>
    );
}

export default function LoadUserStatusThenStudentTab({model}) {
    const userStatus = useUserStatus();

    if (!userStatus) {
        return null;
    }
    return (
        <StudentResourceTab model={model} userStatus={userStatus} />
    );
}
