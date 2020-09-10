import React, {useState, useEffect} from 'react';
import FeaturedResources from './featured-resources/featured-resources.jsx';
import {instructorResourceBoxPermissions} from '../resource-box/resource-box';
import ResourceBoxes, {VideoResourceBoxes} from '../resource-box/resource-boxes';
import partnerFeaturePromise, {tooltipText} from '~/models/salesforce-partners';
import shuffle from 'lodash/shuffle';
import Partners from './partners/partners';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import WrappedJsx from '~/controllers/jsx-wrapper';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './instructor-resource-tab.css';

function FreeStuff({heading, blurb}) {
    return (
        <div className="free-stuff-blurb">
            <RawHTML Tag="h2" html={heading} />
            <RawHTML className="blurb-body" html={blurb} />
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

function resourceBoxModel(resourceData, userStatus, bookId, dialogProps) {
    const isCompCopyLink = (/comp-copy/).test(resourceData.link_document_url);

    return Object.assign(
        {
            heading: resourceData.resource_heading,
            description: resourceData.resource_description,
            creatorFest: resourceData.creator_fest_resource,
            comingSoon: Boolean(resourceData.coming_soon_text),
            comingSoonText: resourceData.coming_soon_text,
            featured: resourceData.featured,
            k12: resourceData.k12,
            dialogProps: isCompCopyLink ? dialogProps : null,
            videoReferenceNumber: resourceData.video_reference_number,
            trackResource: Boolean(userStatus.isInstructor) &&
                {
                    book: bookId,
                    // eslint-disable-next-line camelcase
                    account_id: userStatus.userInfo.accounts_id,
                    // eslint-disable-next-line camelcase
                    resource_name: resourceData.resource_heading
                },
            printLink: resourceData.print_link
        },
        instructorResourceBoxPermissions(resourceData, userStatus, 'Instructor resources')
    );
}

function toBlurb(partner) {
    return {
        image: partner.partner_logo,
        name: partner.partner_name,
        description: partner.short_partner_description,
        cost: partner.affordability_cost,
        type: partner.partner_type,
        url: `/partners?${partner.partner_name}`,
        verifiedFeatures: partner.verified_by_instructor ? tooltipText : false
    };
}

export function InstructorResourceTabJsx({
    bookId,
    bookAbbreviation,
    userStatusPromise,
    featuredResourcesHeader,
    model,
    dialogProps,
    partnerListLabel,
    seeMoreText
}) {
    const {webinar, freeStuff, communityResource} = model;
    const [userStatus, updateUserStatus] = useState({});
    const [includePartners, updateIncludePartners] = useState('');
    const [blurbs, updateBlurbs] = useState([]);

    useEffect(() => {
        async function fetchData() {
            userStatusPromise.then(updateUserStatus);
            const pd = (await partnerFeaturePromise).filter(
                (p) => {
                    const books = (p.books || '').split(';');

                    return books.includes(bookAbbreviation);
                }
            );

            if (pd.length > 0) {
                updateIncludePartners('include-partners');
            }
            updateBlurbs(shuffle(pd).map(toBlurb));
        }
        fetchData();
    }, [userStatusPromise]);

    const featuredModels = model.featuredResources
        .map((res) => resourceBoxModel(res, userStatus, bookId));
    const blogLinkModels = model.blogLinkResources
        .map((res) => resourceBoxModel(res, userStatus, bookId, dialogProps));
    const referenceModels = model.referenceResources
        .map((res) => resourceBoxModel(res, userStatus, bookId, dialogProps));
    const otherModels = model.otherResources
        .map((res) => resourceBoxModel(res, userStatus, bookId, dialogProps));
    const partnersModel = {
        title: partnerListLabel,
        seeMoreText,
        blurbs,
        badgeImage: '/images/partners/verified-badge.svg'
    };

    return (
        <div className="instructor-resources">
            <div>
                <FreeStuff {...freeStuff} />
                {
                    featuredModels.length > 0 &&
                        <FeaturedResourcesSection header={featuredResourcesHeader} models={featuredModels} />
                }
                <div className={`cards ${includePartners}`}>
                    <div className="resources">
                        <VideoResourceBoxes
                            models={model.videoResources}
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

export default class extends WrappedJsx {

    init(props, el) {
        super.init(InstructorResourceTabJsx, props, el);
    }

}
