import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {studentResourceBoxPermissions} from '../../common/resource-box/resource-box';
import useUserContext from '~/contexts/user';
import ResourceBoxes from '../../common/resource-box/resource-boxes';
import './student-resource-tab.scss';

function resourceBoxModel(resourceData, userStatus, bookModel) {
    return Object.assign({
        heading: resourceData.resourceHeading,
        description: resourceData.resourceDescription,
        comingSoon: Boolean(resourceData.comingSoonText),
        comingSoonText: resourceData.comingSoonText,
        printLink: resourceData.printLink,
        bookModel
    }, studentResourceBoxPermissions(resourceData, userStatus, 'Student resources'));
}

function StudentResourceTab({model, userStatus}) {
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
                data-analytics-content-list="student_resources"
                data-list-name="Student Resources"
            >
                <ResourceBoxes models={models} />
            </div>
        </div>
    );
}

export default function LoadUserStatusThenStudentTab({model}) {
    const {userStatus} = useUserContext();

    if (!userStatus) {
        return null;
    }
    return (
        <StudentResourceTab model={model} userStatus={userStatus} />
    );
}
