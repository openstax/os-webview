import React, {useState, useEffect, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import routerBus from '~/helpers/router-bus';
import {instructorResourceBoxPermissions} from '../../common/resource-box/resource-box';
import FeaturedResources from '../../common/featured-resources/featured-resources.js';
import ResourceBoxes, {VideoResourceBoxes} from '../../common/resource-box/resource-boxes';
import {useUserStatus} from '../../common/hooks';
import WrappedJsx from '~/controllers/jsx-wrapper';
import './instructor-resources-pane.css';

function resourceBoxModel(resourceData, userStatus, bookId) {
    return Object.assign({
        heading: resourceData.resourceHeading,
        description: '',
        creatorFest: resourceData.creatorFestResource,
        comingSoon: Boolean(resourceData.comingSoonText),
        comingSoonText: '',
        k12: resourceData.k12,
        videoReferenceNumber: resourceData.videoReferenceNumber,
        trackResource: Boolean(userStatus.isInstructor) &&
            {
                book: bookId,
                // eslint-disable-next-line camelcase
                account_id: userStatus.userInfo.accounts_id,
                // eslint-disable-next-line camelcase
                resource_name: resourceData.resourceHeading
            },
        printLink: resourceData.printLink
    }, instructorResourceBoxPermissions(resourceData, userStatus, 'Instructor resources'));
}

function FeaturedResourcesSection({header, models}) {
    return (
        <div>
            <div className="featured-resources">
                <FeaturedResources headline={header} resources={models} />
            </div>
            <div className="divider">
                <div className="line"></div>
                see additional resources below
                <div className="line"></div>
            </div>
        </div>
    );
}

export function InstructorResourcesPane({model, userStatus}) {
    const bookId = model.id;
    const featuredResources = model.bookFacultyResources.filter((r) => r.featured);
    const featuredModels = featuredResources
        .map((res) => resourceBoxModel(res, userStatus, bookId));
    const referenceModels = model.bookFacultyResources
        .filter((r) => r.videoReferenceNumber !== null)
        .map((res) => resourceBoxModel(res, userStatus, bookId));
    const otherModels = model.bookFacultyResources
        .filter((r) =>
            !r.featured && r.videoReferenceNumber === null &&
            r.linkText !== 'View resources'
        )
        .map((res) => resourceBoxModel(res, userStatus, bookId));

    function goToPartners(event) {
        event.preventDefault();
        routerBus.emit('navigate', '/partners', {
            book: model.salesforceAbbreviation
        }, true);
    }

    return (
        <div className="instructor-resources-pane">
            {
                featuredModels.length > 0 &&
                    <FeaturedResourcesSection header={model.featuredResourcesHeader} models={featuredModels} />
            }
            <a className="card filter-for-book" onClick={goToPartners}>
                OpenStax Partners{' '}
                <FontAwesomeIcon icon="sign-out-alt" />
            </a>
            <div className="free-resources-region">
                <VideoResourceBoxes models={model.bookVideoFacultyResources} referenceModels={referenceModels} />
                <ResourceBoxes models={otherModels} />
            </div>
        </div>
    );
}

export default function LoadUserStatusThenInstructorPane({model}) {
    const userStatus = useUserStatus();

    if (!userStatus) {
        return null;
    }
    return (
        <InstructorResourcesPane model={model} userStatus={userStatus} />
    );
}
