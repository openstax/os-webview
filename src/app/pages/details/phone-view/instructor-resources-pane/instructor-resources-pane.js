import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import {useNavigate} from 'react-router-dom';
import {instructorResourceBoxPermissions} from '../../common/resource-box/resource-box';
import FeaturedResourcesSection from '../../common/featured-resources/featured-resources.js';
import ResourceBoxes, {VideoResourceBoxes} from '../../common/resource-box/resource-boxes';
import useUserContext from '~/contexts/user';
import useWindowContext, {WindowContextProvider} from '~/contexts/window';
import './instructor-resources-pane.scss';

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
    const navigate = useNavigate();

    function goToPartners(event) {
        event.preventDefault();
        navigate('/partners', {
            book: model.salesforceAbbreviation,
            redirect: true
        });
    }

    return (
        <React.Fragment>
            {
                featuredModels.length > 0 &&
                    <FeaturedResourcesSection header={model.featuredResourcesHeader} models={featuredModels} />
            }
            <a className="card filter-for-book" onClick={goToPartners}>
                OpenStax Partners{' '}
                <FontAwesomeIcon icon={faSignOutAlt} />
            </a>
            <div className="free-resources-region">
                <VideoResourceBoxes models={model.bookVideoFacultyResources} referenceModels={referenceModels} />
                <ResourceBoxes models={otherModels} includeCommonsHub />
            </div>
        </React.Fragment>
    );
}

function StubUnlessDisplayed({model, userStatus}) {
    const ref = React.useRef();
    const [y, setY] = React.useState(null);
    const {scrollY} = useWindowContext();

    React.useEffect(
        () => setY(ref.current?.getBoundingClientRect().y),
        [scrollY]
    );

    return (
        <div className="instructor-resources-pane" ref={ref}>
            {
                y ?
                    <InstructorResourcesPane model={model} userStatus={userStatus} /> :
                    null
            }
        </div>
    );
}

export default function LoadUserStatusThenInstructorPane({model}) {
    const {userStatus} = useUserContext();

    if (!userStatus) {
        return null;
    }
    return (
        <WindowContextProvider>
            <StubUnlessDisplayed model={model} userStatus={userStatus} />
        </WindowContextProvider>
    );
}
