import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import {useNavigate} from 'react-router-dom';
import {resourceBoxModel, useResources} from '../../common/resource-box/resource-box';
import FeaturedResourcesSection from '../../common/featured-resources/featured-resources.js';
import ResourceBoxes from '../../common/resource-box/resource-boxes';
import VideoResourceBoxes from '../../common/resource-box/video-resource-box';
import useUserContext from '~/contexts/user';
import useWindowContext, {WindowContextProvider} from '~/contexts/window';
import './instructor-resources-pane.scss';

export function InstructorResourcesPane({model, userStatus}) {
    const {
        bookVideoFacultyResources,
        bookFacultyResources
    } = useResources(model.slug);
    const bookId = model.id;

    for (const r of bookFacultyResources) {
        r.resource.description = '';
        r.resource.comingSoonText = '';
    }
    const featuredResources = bookFacultyResources.filter((r) => r.featured);
    const featuredModels = featuredResources
        .map((res) => resourceBoxModel(res, userStatus, bookId));
    const referenceModels = bookFacultyResources
        .filter((r) => r.videoReferenceNumber !== null)
        .map((res) => resourceBoxModel(res, userStatus, bookId));
    const otherModels = bookFacultyResources
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
                    <FeaturedResourcesSection
                        data-analytics-content-list="Instructor Featured Resources"
                        header={model.featuredResourcesHeader}
                        models={featuredModels}
                    />
            }
            <a className="card filter-for-book" onClick={goToPartners}>
                OpenStax Partners{' '}
                <FontAwesomeIcon icon={faSignOutAlt} />
            </a>
            <div
                className="free-resources-region"
                data-analytics-content-list="instructor_resources"
                data-list-name="Instructor Resources"
            >
                <VideoResourceBoxes models={bookVideoFacultyResources} referenceModels={referenceModels} />
                <ResourceBoxes models={otherModels} includeCommonsHub />
            </div>
        </React.Fragment>
    );
}

function StubUnlessDisplayed({model, userStatus}) {
    const ref = React.useRef();
    const [y, setY] = React.useState(null);
    const {innerWidth, scrollY} = useWindowContext();

    React.useEffect(
        () => setY(y || ref.current?.getBoundingClientRect().y),
        [innerWidth, scrollY, y]
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
