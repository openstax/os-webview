import React from 'react';
import {FormattedMessage} from 'react-intl';
import linkHelper from '~/helpers/link';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {useDataFromSlug, camelCaseKeys} from '~/helpers/page-data-utils';
import { useToggle } from '~/helpers/data';
import useUserContext from '~/contexts/user';
import useDetailsContext from '../../context';
import CompCopyRequestForm from './request-form/request-form';
import Dialog from '~/components/dialog/dialog';
import CustomizationForm from '../customization-form/customization-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons/faShoppingCart';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import cn from 'classnames';

const settings = window.SETTINGS;

export default function ResourceBox({ model }) {
    const classNames = {
        double: model.double,
        'coming-soon': model.comingSoon
    };

    return (
        <div className={cn('resource-box', classNames)}>
            <ReferenceNumber referenceNumber={model.videoReferenceNumber} />
            <Top model={model} isNew={model.isNew} />
            <Bottom model={model} />
        </div>
    );
}

function encodeLocation(search) {
    const pathWithoutSearch = `${window.location.origin}${window.location.pathname}`;

    return encodeURIComponent(`${pathWithoutSearch}?${search}`);
}

function resourceBoxPermissions({
    resourceData, resourceStatus, loginUrl
}) {
    const isExternal = Boolean(resourceData.linkExternal);
    const status = resourceStatus();
    const statusToPermissions = {
        unlocked: {
            iconType: isExternal ? 'external-link-alt' : 'download',
            link: {
                text: resourceData.linkText,
                url: resourceData.linkExternal || resourceData.linkDocumentUrl ||
                    resourceData.linkDocument?.file
            }
        },
        pending: {
            iconType: 'lock'
        },
        locked: {
            iconType: 'lock',
            link: {
                text: <FormattedMessage id="resources.loginToUnlock" />,
                url: loginUrl
            }
        }
    };

    return statusToPermissions[status];
}

// Utility function to set the values associated with whether the resource
// is available to the user (instructor version)
export function instructorResourceBoxPermissions(resourceData, userStatus, search) {
    const resourceStatus = () => {
        if (resourceData?.resource?.resourceUnlocked || userStatus.isInstructor) {
            return 'unlocked';
        }
        if (userStatus.pendingVerification) {
            return 'pending';
        }
        return 'locked';
    };
    const encodedLocation = encodeLocation(search);
    const loginUrl = userStatus.userInfo?.id ?
        `${settings.accountHref}/faculty_access/apply?r=${encodedLocation}` :
        linkHelper.loginLink();

    return resourceBoxPermissions({
        resourceData,
        resourceStatus,
        loginUrl
    });
}

const emptyResources = {
    bookVideoFacultyResources: [],
    bookFacultyResources: []
};

export function useResources(slug) {
    const {isVerified} = useUserContext();
    const title = slug.replace('books/', '');
    const rawResources = useDataFromSlug(
        `books/resources/?slug=${title}&x=${isVerified ? 'x' : 'y'}`
    );
    const resources = React.useMemo(
        () => rawResources?.error ? null : camelCaseKeys(rawResources),
        [rawResources]
    );

    return resources || emptyResources;
}

export function resourceBoxModel(resourceData, userStatus, bookModel) {
    return Object.assign(
        {
            id: resourceData.resource.id,
            heading: resourceData.resource.heading,
            resourceCategory: resourceData.resource.resourceCategory,
            description: resourceData.resource.description,
            creatorFest: resourceData.resource.creatorFestResource,
            comingSoon: Boolean(resourceData.comingSoonText),
            comingSoonText: resourceData.comingSoonText,
            k12: resourceData.k12,
            videoReferenceNumber: resourceData.videoReferenceNumber,
            trackResource: Boolean(userStatus.isInstructor) &&
                {
                    book: bookModel.id,
                    // eslint-disable-next-line camelcase
                    account_id: userStatus.userInfo.accounts_id,
                    // eslint-disable-next-line camelcase
                    resource_name: resourceData.resource.heading
                },
            printLink: resourceData.printLink,
            bookModel
        },
        instructorResourceBoxPermissions(resourceData, userStatus, 'Instructor resources')
    );
}

// Utility function for student resources
export function studentResourceBoxPermissions(resourceData, userStatus) {
    const resourceStatus = () => {
        if (resourceData.resourceUnlocked || userStatus.isStudent || userStatus.isInstructor) {
            return 'unlocked';
        }
        return 'locked';
    };

    return resourceBoxPermissions({
        resourceData,
        resourceStatus,
        loginUrl: linkHelper.loginLink()
    });
}

function useDoneWaitingForModelChange(model) {
    const [timeIsUp, toggle] = useToggle(false);
    const timerRef = React.useRef();

    React.useEffect(
        () => {
            window.clearTimeout(timerRef.current);
            toggle(false);
            timerRef.current = window.setTimeout(
                () => toggle(true),
                250
            );
        },
        [model, toggle]
    );

    return timeIsUp;
}

// eslint-disable-next-line complexity
function Top({ isNew, model }) {
    const description = model.comingSoon ?
        `<p>${model.comingSoonText}</p>` :
        model.description;

    return (
        <div className="top">
            {isNew && <NewLabel />}
            {model.k12 && (
                <img
                    className="badge"
                    src="/dist/images/details/k-12-icon@3x.png"
                    alt="K12 resource"
                />
            )}
            <div className="top-line">
                <h3 className={model.k12 ? 'space-for-badge' : ''}>
                    {model.heading}
                </h3>
                {model.creatorFest && (
                    <img
                        title="This resource was created by instructors at Creator Fest"
                        src="/dist/images/details/cf-badge.svg"
                    />
                )}
            </div>
            <RawHTML className="description" html={description} />
        </div>
    );
}

function ReferenceNumber({ referenceNumber }) {
    return (
        referenceNumber !== null && (
            <div className="reference-number">{referenceNumber}</div>
        )
    );
}

// eslint-disable-next-line complexity
function LeftContent({ model }) {
    const { userStatus } = useUserContext();
    const doneWaiting = useDoneWaitingForModelChange(model);

    if (!model.link) {
        return <AccessPending />;
    }

    if (!model.link.url) {
        return doneWaiting && !model.comingSoon ? <MissingLink /> : null;
    }

    // logged in but not an instructor
    if (model.iconType === 'lock' && userStatus.isInstructor === false) {
        return (
            <div className="left-no-button">
                <FontAwesomeIcon icon={faLock} />
                <FormattedMessage
                    id="resources.available"
                    defaultMessage="Only available for verified instructors."
                />
            </div>
        );
    }

    return <LeftButton model={model} />;
}

function Bottom({ model }) {
    if (model.comingSoon && model.iconType === 'lock') {
        return null;
    }
    return (
        <div className="bottom">
            <LeftContent model={model} />
            {model.printLink && (
                <a className="print-link" href={model.printLink}>
                    <FontAwesomeIcon icon={faShoppingCart} />
                    <span>Buy print</span>
                </a>
            )}
        </div>
    );
}

function NewLabel() {
    return (
        <div className="new-label-container">
            <span className="new-label">NEW</span>
        </div>
    );
}

function AccessPending() {
    return (
        <span className="left">
            <FontAwesomeIcon icon={faLock} />
            <span>Access Pending</span>
        </span>
    );
}

function MissingLink() {
    return (
        <span className="left missing-link">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>MISSING LINK</span>
        </span>
    );
}

// Adapted from get-this-title interceptLinkClicks
function interceptLinkClicks(event, book, userModel) {
    const el = linkHelper.validUrlClick(event);

    if (!el) {
        return;
    }
    const trackThis = userModel?.accounts_id && el.dataset.track;

    if (trackThis) {
        /* eslint-disable camelcase */
        event.trackingInfo = {
            book,
            account_uuid: userModel.uuid,
            resource_name: el.dataset.track,
            contact_id: userModel.salesforce_contact_id
        };
        /* eslint-enable camelcase */
    }
}

function LeftButton({ model }) {
    const [isOpen, toggle] = useToggle(false);
    const isCompCopy = model.link.url.endsWith('comp-copy');
    const isCustomization = model.link.url.endsWith('customized-modules');
    const icon =
        {
            lock: faLock,
            download: faDownload,
            'external-link-alt': faExternalLinkAlt
        }[model.iconType] || faExclamationTriangle;
    const { userModel } = useUserContext();

    function openDialog(event) {
        if (isCompCopy || isCustomization) {
            event.preventDefault();
            toggle();
        } else if (model.bookModel) {
            interceptLinkClicks(event, model.bookModel.id, userModel);
        }
    }

    return (
        <React.Fragment>
            <a
                className="left-button"
                href={model.link.url}
                data-local={model.iconType === 'lock'}
                onClick={openDialog}
                data-track={model.heading}
                data-analytics-select-content={model.heading}
                data-content-type={`Book Resource (${model.resourceCategory})`}
            >
                <FontAwesomeIcon icon={icon} />
                <span>{model.link.text}</span>
            </a>
            {isCompCopy && <IbooksDialog {...{ model, isOpen, toggle }} />}
            {isCustomization && <CustomizationDialog {...{ isOpen, toggle }} />}
        </React.Fragment>
    );
}

function IbooksDialog({ model, isOpen, toggle }) {
    const bookModel = useDetailsContext();

    if (!('bookModel' in model)) {
        model.bookModel = bookModel;
    }

    function done(event) {
        event.preventDefault();
        event.stopPropagation();
        toggle();
    }

    return (
        <Dialog
            isOpen={isOpen}
            onPutAway={toggle}
            title="Request a complimentary iBooks title"
        >
            <CompCopyRequestForm model={model} done={done} />
        </Dialog>
    );
}

function CustomizationDialog({ isOpen, toggle }) {
    const bookModel = useDetailsContext();

    function done(event) {
        event.preventDefault();
        event.stopPropagation();
        toggle();
    }

    return (
        <Dialog
            isOpen={isOpen}
            onPutAway={toggle}
            title={bookModel.customizationFormHeading}
        >
            <CustomizationForm model={bookModel} done={done} />
        </Dialog>
    );
}
