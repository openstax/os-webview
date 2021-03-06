import React, {useContext} from 'react';
import {RawHTML, useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './resource-box.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import {faLock} from '@fortawesome/free-solid-svg-icons/faLock';
import {faDownload} from '@fortawesome/free-solid-svg-icons/faDownload';
import {faShoppingCart} from '@fortawesome/free-solid-svg-icons/faShoppingCart';
import {faPlay} from '@fortawesome/free-solid-svg-icons/faPlay';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import Dialog from '~/components/dialog/dialog';
import analytics from '~/helpers/analytics';
import CompCopyRequestForm from './request-form/request-form';
import CustomizationForm from '../customization-form/customization-form';
import DetailsContext from '../../context';
import {useUserStatus} from '../hooks';
import linkhelper from '~/helpers/link';
import cn from 'classnames';

const UserContext = React.createContext({});

function CommonsHubBox({model}) {
    return (
        <div className="resource-box double">
            <div className="top-line">
                <h3>{model.heading}</h3>
                <img src={model.logoUrl} alt="" />
            </div>
            <div className="blurb">
                <RawHTML Tag="span" html={model.blurb} />
                <br />
                <a href={model.url}>
                    {model.cta}{' '}
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                </a>
            </div>
            <div className="bottom">
                <div className="right">
                    {
                        model.featureUrl &&
                            <a href={model.featureUrl}>
                                {model.featureText}
                            </a>
                    }
                </div>
            </div>
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

// eslint-disable-next-line complexity
function Top({isNew, model}) {
    const description = model.comingSoon ? `<p>${model.comingSoonText}</p>` : model.description;

    return (
        <div className="top">
            {isNew && <NewLabel />}
            {
                model.k12 &&
                <img className="badge" src="/images/details/k-12-icon@3x.png" alt="K12 resource" />
            }
            <div className="top-line">
                <h3 className={model.k12 ? 'space-for-badge' : ''}>{model.heading}</h3>
                {
                    model.creatorFest &&
                        <img
                            title="This resource was created by instructors at Creator Fest"
                            src="/images/details/cf-badge.svg"
                        />
                }
            </div>
            <RawHTML className="description" html={description} />
        </div>
    );
}

function BottomBasic({leftContent, icon}) {
    return (
        <div className="bottom">
            <a className="left">
                <FontAwesomeIcon icon={icon} />
                {leftContent}
            </a>
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

function IbooksDialog({model, isOpen, toggle}) {
    const bookModel = useContext(DetailsContext);

    if (! ('bookModel' in model)) {
        model.bookModel = bookModel;
    }

    function done(event) {
        event.preventDefault();
        event.stopPropagation();
        toggle();
    }

    return (
        <Dialog
            isOpen={isOpen} onPutAway={toggle}
            title="Request a complimentary iBooks title"
        >
            <CompCopyRequestForm model={model} done={done} />
        </Dialog>
    );
}

function CustomizationDialog({isOpen, toggle}) {
    const bookModel = useContext(DetailsContext);

    function done(event) {
        event.preventDefault();
        event.stopPropagation();
        toggle();
    }

    React.useEffect(() => {
        if (isOpen) {
            analytics.sendPageEvent(
                'Instructor resources',
                'open',
                'Google Docs Customization'
            );
        }
    }, [isOpen]);

    return (
        <Dialog
            isOpen={isOpen} onPutAway={toggle}
            title={bookModel.customizationFormHeading}
        >
            <CustomizationForm model={bookModel} done={done} />
        </Dialog>
    );
}

// Adapted from get-this-title interceptLinkClicks
function interceptLinkClicks(event, model, userInfo) {
    const el = linkhelper.validUrlClick(event);
    const book = model.bookModel.id;

    if (!el) {
        return;
    }
    const trackThis = userInfo.accounts_id && el.dataset.track;

    if (trackThis) {
        /* eslint-disable camelcase */
        event.trackingInfo = {
            book,
            account_id: userInfo.accounts_id,
            resource_name: el.dataset.track,
            contact_id: userInfo.salesforce_contact_id
        };
        /* eslint-enable camelcase */
    }
}

function LeftButton({model}) {
    const [isOpen, toggle] = useToggle(false);
    const isCompCopy = model.link.url.endsWith('comp-copy');
    const isCustomization = model.link.url.endsWith('customized-modules');
    const icon = ({
        'lock': faLock,
        'download': faDownload,
        'external-link-alt': faExternalLinkAlt
    })[model.iconType] || faExclamationTriangle;
    const {userInfo} = useContext(UserContext);

    function openDialog(event) {
        if (isCompCopy || isCustomization) {
            event.preventDefault();
            toggle();
        } else {
            interceptLinkClicks(event, model, userInfo);
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
            >
                <FontAwesomeIcon icon={icon} />
                <span>{model.link.text}</span>
            </a>
            {isCompCopy && <IbooksDialog {...{model, isOpen, toggle}} />}
            {isCustomization && <CustomizationDialog {...{isOpen, toggle}} />}
        </React.Fragment>
    );
}

function LeftContent({model}) {
    const userStatus = useContext(UserContext);

    if (!model.link) {
        return (<AccessPending />);
    }
    if (!model.link.url) {
        return (<MissingLink />);
    }

    // logged in but not an instructor
    if (model.iconType === 'lock' && userStatus.isInstructor === false) {
        return (
            <div className="left-no-button">
                <FontAwesomeIcon icon={faLock} />
                <span>Only available for verified instructors.</span>
            </div>
        );
    }

    return (<LeftButton model={model} />);
}

function Bottom({model}) {
    return (
        <div className="bottom">
            <LeftContent model={model} />
            {
                model.printLink &&
                    <a className="print-link" href={model.printLink}>
                        <FontAwesomeIcon icon={faShoppingCart} />
                        <span>Buy print</span>
                    </a>
            }
        </div>
    );
}

function ReferenceNumber({referenceNumber}) {
    return (
        referenceNumber !== null &&
            <div className="reference-number">{referenceNumber}</div>
    );
}

function ResourceBox({model}) {
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

export default function ResourceBoxes({models, communityResource}) {
    const userStatus = useUserStatus();

    return (
        <UserContext.Provider value={userStatus}>
            {
                communityResource &&
                    <CommonsHubBox model={communityResource} key={communityResource.heading} />
            }
            {
                models.map((model) =>
                    <ResourceBox model={model} key={model.heading} />
                )
            }
        </UserContext.Provider>
    );
}

function VideoResourceBox({model}) {
    const [isOpen, toggle] = useToggle(false);

    function onClick(event) {
        event.preventDefault();
        toggle();
    }

    return (
        <div className="video resource-box" onClick={onClick} key={model.resource_heading}>
            <div>
                <div className="top-line">
                    <h3>{model.resource_heading}</h3>
                </div>
                <RawHTML className="description" html={model.resource_description} />
                <video controls preload="metadata">
                    <source src={model.video_file} type="video/avi" />
                </video>
            </div>
            <BottomBasic leftContent="Watch video" icon={faPlay} />
            <Dialog
                isOpen={isOpen} onPutAway={toggle}
                title={model.video_title || model.resource_heading}
            >
                <ResourceVideoViewer customClass="reverse-colors" />
            </Dialog>
        </div>
    );
}

function VideoViewer({file}) {
    return (
        <div className="aspect-16-by-9-container">
            <video controls src={file} />
        </div>
    );
}

function ResourceVideoViewer(...args) {
    return (
        <div className="instructor-resource-video-viewer">
            <VideoViewer {...args} />
        </div>
    );
}

export function VideoResourceBoxes({models, blogLinkModels, referenceModels}) {
    const userStatus = useUserStatus();

    return (
        <UserContext.Provider value={userStatus}>
            {
                models.map((model) =>
                    <VideoResourceBox {...{model}} key={model.video_file} />
                )
            }
            {
                blogLinkModels && blogLinkModels.map((model) =>
                    <ResourceBox model={model} key={model.heading} />
                )
            }
            {
                referenceModels.map((model) =>
                    <ResourceBox model={model} key={model.heading} />
                )
            }
        </UserContext.Provider>
    );
}
