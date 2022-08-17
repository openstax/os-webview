import React from 'react';
import FeaturedResourcesSection from '../../common/featured-resources/featured-resources.js';
import {resourceBoxModel, useResources} from '../../common/resource-box/resource-box';
import ResourceBoxes, {VideoResourceBoxes} from '../../common/resource-box/resource-boxes';
import Partners from './partners/partners';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import {faDesktop} from '@fortawesome/free-solid-svg-icons/faDesktop';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {usePartnerFeatures} from '../../common/hooks';
import useUserContext from '~/contexts/user';
import useDetailsContext from '~/pages/details/context';
import useWindowContext from '~/contexts/window';
import './instructor-resource-tab.scss';

function FreeStuff({freeStuffContent, userStatus}) {
    const blurbLookupByInstructorStatus = {
        undefined: freeStuffContent.content,
        true: freeStuffContent.contentLoggedIn,
        false: <div className="blurb-body">
            <FontAwesomeIcon icon={faExclamationCircle} />{' '}
            Your account must be instructor verified...
            <a href="https://openstax.secure.force.com/help/articles/FAQ/Requesting-Instructor-only-access-to-the-resources-on-openstax-org">How do I do that?</a>
        </div>
    };
    const blurbContent = blurbLookupByInstructorStatus[userStatus.isInstructor];
    const blurbJsx = typeof blurbContent === 'string' ?
        <RawHTML className="blurb-body" html={blurbContent} /> :
        blurbContent;

    return (
        <div className="free-stuff-blurb">
            <RawHTML Tag="h2" html={freeStuffContent.heading} />
            {blurbJsx}
        </div>
    );
}

function Webinar() {
    const {webinarContent} = useDetailsContext();

    if (!webinarContent.content) {
        return null;
    }

    const text = webinarContent.content.heading;
    const url = webinarContent.link;
    const blurb = webinarContent.content.content;

    return (
        <a href={url} className="webinars">
            <div className="icon-cell">
                <FontAwesomeIcon icon={faDesktop} />
            </div>
            <div className="blurb">
                <h2>{text}</h2>
                <RawHTML className="blurb" html={blurb} />
            </div>
        </a>
    );
}

function InstructorResourceTab({model, userStatus}) {
    const bookAbbreviation = model.salesforceAbbreviation;
    const {
        bookVideoFacultyResources,
        bookFacultyResources
    } = useResources(model.slug);

    const featuredModels = bookFacultyResources
        .filter((r) => r.featured)
        .map((res) => resourceBoxModel(res, userStatus, model));
    const blogLinkModels = bookFacultyResources
        .filter((r) => r.linkText === 'View resources')
        .map((res) => resourceBoxModel(res, userStatus, model));
    const referenceModels = bookFacultyResources
        .filter((r) => r.videoReferenceNumber !== null)
        .map((res) => resourceBoxModel(res, userStatus, model));
    const otherModels = bookFacultyResources
        .filter((r) =>
            !r.featured && r.videoReferenceNumber === null &&
            r.linkText !== 'View resources'
        )
        .map((res) => resourceBoxModel(res, userStatus, model));

    const partnerListLabel = model.partnerListLabel || '[partner_list_label]';
    const seeMoreText = model.partnerPageLinkText || '[partner_page_link_text]';
    const [blurbs, includePartners] = usePartnerFeatures(bookAbbreviation);
    const partnersModel = {
        title: partnerListLabel,
        seeMoreText,
        blurbs,
        badgeImage: '/dist/images/partners/verified-badge.svg'
    };
    const freeStuffContent = model.freeStuffInstructor.content;

    return (
        <React.Fragment>
            <div>
                <FreeStuff {...{freeStuffContent, userStatus}} />
                {
                    featuredModels.length > 0 &&
                        <FeaturedResourcesSection
                            header={model.featuredResourcesHeader}
                            models={featuredModels}
                        />
                }
                <div className={`cards ${includePartners}`}>
                    <div className="resources">
                        <VideoResourceBoxes
                            models={bookVideoFacultyResources}
                            blogLinkModels={blogLinkModels}
                            referenceModels={referenceModels}
                        />
                        <ResourceBoxes models={otherModels} includeCommonsHub />
                    </div>
                    <Partners
                        bookAbbreviation={bookAbbreviation}
                        model={partnersModel}
                    />
                </div>
            </div>
            <Webinar />
        </React.Fragment>
    );
}

function StubUnlessDisplayed({model, userStatus}) {
    const ref = React.useRef();
    const [y, setY] = React.useState(null);
    const {innerWidth} = useWindowContext();

    React.useLayoutEffect(
        () => setY(ref.current?.getBoundingClientRect().y),
        [innerWidth]
    );

    return (
        <div className="instructor-resources" ref={ref}>
            {
                y ?
                    <InstructorResourceTab model={model} userStatus={userStatus} /> :
                    null
            }
        </div>
    );
}

export default function LoadUserStatusThenInstructorTab({model}) {
    const {userStatus} = useUserContext();

    if (!userStatus) {
        return null;
    }
    return (
        <StubUnlessDisplayed model={model} userStatus={userStatus} />
    );
}
