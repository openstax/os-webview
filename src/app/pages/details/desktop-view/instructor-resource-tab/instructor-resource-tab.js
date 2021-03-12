import React, {useState, useEffect} from 'react';
import FeaturedResources from '../../common/featured-resources/featured-resources.js';
import {instructorResourceBoxPermissions} from '../../common/resource-box/resource-box';
import ResourceBoxes, {VideoResourceBoxes} from '../../common/resource-box/resource-boxes';
import shuffle from 'lodash/shuffle';
import Partners from './partners/partners';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {useUserStatus, usePartnerFeatures} from '../../common/hooks';
import './instructor-resource-tab.css';

function FreeStuff({freeStuffContent, userStatus}) {
    const blurbLookupByInstructorStatus = {
        undefined: freeStuffContent.content,
        true: freeStuffContent.contentLoggedIn,
        false: <div className="blurb-body">
            <FontAwesomeIcon icon="exclamation-circle" />{' '}
            Your account must be instructor verified...
            <a href="https://openstax.secure.force.com/help">Contact support</a>
            {' '}to get verified.
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

function Webinar({url, text, blurb}) {
    return (
        <a href={url} className="webinars">
            <div className="icon-cell">
                <FontAwesomeIcon icon="desktop" />
            </div>
            <div className="blurb">
                <h2>{text}</h2>
                <RawHTML className="blurb" html={blurb} />
            </div>
        </a>
    );
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

    const webinarContent = model.webinarContent.content;
    const webinar = {
        text: webinarContent.heading,
        url: model.webinarContent.link,
        blurb: webinarContent.content
    };
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
            <Webinar {...webinar} />
        </div>
    );
}

export default function LoadUserStatusThenInstructorTab({model}) {
    const userStatus = useUserStatus();

    if (!userStatus) {
        return null;
    }
    return (
        <InstructorResourceTab model={model} userStatus={userStatus} />
    );
}
