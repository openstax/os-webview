import React from 'react';
import FeaturedResourcesSection from '../../common/featured-resources/featured-resources.js';
import {instructorResourceBoxPermissions} from '../../common/resource-box/resource-box';
import ResourceBoxes, {VideoResourceBoxes} from '../../common/resource-box/resource-boxes';
import Partners from './partners/partners';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import {faDesktop} from '@fortawesome/free-solid-svg-icons/faDesktop';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {usePartnerFeatures} from '../../common/hooks';
import useUserContext from '~/contexts/user';
import useDetailsContext from '~/pages/details/context';
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

function resourceBoxModel(resourceData, userStatus, bookModel) {
    return Object.assign(
        {
            heading: resourceData.resourceHeading,
            description: resourceData.resourceDescription,
            creatorFest: resourceData.creatorFestResource,
            comingSoon: Boolean(resourceData.comingSoonText),
            comingSoonText: resourceData.comingSoonText,
            featured: resourceData.featured,
            k12: resourceData.k12,
            videoReferenceNumber: resourceData.videoReferenceNumber,
            trackResource: Boolean(userStatus.isInstructor) &&
                {
                    book: bookModel.id,
                    // eslint-disable-next-line camelcase
                    account_id: userStatus.userInfo.accounts_id,
                    // eslint-disable-next-line camelcase
                    resource_name: resourceData.resourceHeading
                },
            printLink: resourceData.printLink,
            bookModel
        },
        instructorResourceBoxPermissions(resourceData, userStatus, 'Instructor resources')
    );
}

function InstructorResourceTab({model, userStatus}) {
    const bookAbbreviation = model.salesforceAbbreviation;
    const featuredModels = model.bookFacultyResources
        .filter((r) => r.featured)
        .map((res) => resourceBoxModel(res, userStatus, model));
    const blogLinkModels = model.bookFacultyResources
        .filter((r) => r.linkText === 'View resources')
        .map((res) => resourceBoxModel(res, userStatus, model));
    const referenceModels = model.bookFacultyResources
        .filter((r) => r.videoReferenceNumber !== null)
        .map((res) => resourceBoxModel(res, userStatus, model));
    const otherModels = model.bookFacultyResources
        .filter((r) =>
            !r.featured && r.videoReferenceNumber === null &&
            r.linkText !== 'View resources'
        )
        .map((res) => resourceBoxModel(res, userStatus, model));

    const communityResource = {
        heading: model.communityResourceHeading,
        logoUrl: model.communityResourceLogoUrl,
        url: model.communityResourceUrl,
        cta: model.communityResourceCta,
        blurb: model.communityResourceBlurb,
        featureUrl: model.communityResourceFeatureLinkUrl,
        featureText: model.communityResourceFeatureText
    };
    const partnerListLabel = model.partnerListLabel || '[partner_list_label]';
    const seeMoreText = model.partnerPageLinkText || '[partner_page_link_text]';
    const [blurbs, includePartners] = usePartnerFeatures(bookAbbreviation);
    const partnersModel = {
        title: partnerListLabel,
        seeMoreText,
        blurbs,
        badgeImage: '/images/partners/verified-badge.svg'
    };
    const freeStuffContent = model.freeStuffInstructor.content;

    return (
        <div className="instructor-resources">
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
                            models={model.bookVideoFacultyResources}
                            blogLinkModels={blogLinkModels}
                            referenceModels={referenceModels}
                        />
                        <ResourceBoxes communityResource={communityResource} models={otherModels} />
                    </div>
                    <Partners
                        bookAbbreviation={bookAbbreviation}
                        model={partnersModel}
                    />
                </div>
            </div>
            <Webinar />
        </div>
    );
}

export default function LoadUserStatusThenInstructorTab({model}) {
    const {userStatus} = useUserContext();

    if (!userStatus) {
        return null;
    }
    return (
        <InstructorResourceTab model={model} userStatus={userStatus} />
    );
}
