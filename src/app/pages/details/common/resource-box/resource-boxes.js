import React, {useState} from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './resource-box.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import $ from '~/helpers/$';
import showDialog, {hideDialog} from '../show-dialog';
import CompCopyRequestForm from './request-form/request-form';
import {pageWrapper} from '~/controllers/jsx-wrapper';

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
                    <FontAwesomeIcon icon="external-link-alt" />
                </a>
            </div>
            <div className="bottom">
                <div className="left" />
                <div className="right">
                    <a href={model.featureUrl}>
                        {model.featureText}
                    </a>
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

function LeftContent({model, icon}) {
    const isCompCopy = model.link.url.endsWith('comp-copy');

    function handleCompCopyRequest(event) {
        if (isCompCopy) {
            showDialog({
                event,
                dialogTitle: 'Request a complimentary iBooks title',
                dialogContent: CompCopyRequestForm,
                dialogContentArgs: {model, done: hideDialog}
            });
            event.preventDefault();
        }
    }

    return (
        model.link ?
            <a
                className="left-button"
                href={model.link.url}
                data-local={model.iconType === 'lock'}
                onClick={handleCompCopyRequest}
            >
                <FontAwesomeIcon icon={model.iconType} />
                <span>{model.link.text}</span>
            </a> :
            <span>
                <FontAwesomeIcon icon="lock" />
                Access Pending
            </span>
    );
}

function Bottom({model, overrideIcon}) {
    const icon = model.link ? model.iconType : 'lock';

    return (
        <div className="bottom">
            <LeftContent model={model} icon={overrideIcon || icon} />
            {
                model.printLink &&
                    <a className="print-link" href={model.printLink}>
                        <FontAwesomeIcon icon="shopping-cart" />
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

function ResourceBox({model, icon}) {
    const classNames = ['resource-box'];
    const [isNew, updateIsNew] = useState(model.isNew);
    const onClick = (event) => {
        if (model.dialogProps) {
            event.preventDefault();
            event.stopPropagation();
            shellBus.emit('showDialog', () => model.dialogProps);
        }
        if (model.onClick) {
            model.onClick(event);
        }
        updateIsNew(model.isNew);
        if (model.trackResource) {
            fetch(
                `${$.apiOriginAndOldPrefix}/salesforce/download-tracking/`,
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(model.trackResource)
                }
            );
        }
    };

    if (model.double) {
        classNames.push('double');
    }
    if (model.comingSoon) {
        classNames.push('coming-soon');
    }

    return (
        <div className={classNames.join(' ')}>
            <ReferenceNumber referenceNumber={model.videoReferenceNumber} />
            <Top model={model} isNew={isNew} />
            <Bottom model={model} overrideIcon={icon} />
        </div>
    );
}

export default function ResourceBoxes({models, communityResource}) {
    return (
        <React.Fragment>
            {
                communityResource &&
                    <CommonsHubBox model={communityResource} key={communityResource.heading} />
            }
            {
                models.map((model) =>
                    <ResourceBox model={model} key={model.heading} />
                )
            }
        </React.Fragment>
    );
}

function VideoResourceBox({model, onClick}) {
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
            <BottomBasic leftContent="Watch video" icon="play" />
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
const SuperbVideoViewer = pageWrapper(VideoViewer, {classes: ['instructor-resource-video-viewer']});

export function VideoResourceBoxes({models, blogLinkModels, referenceModels}) {
    function onClick(event) {
        const [model] = models;
        const dialogProps = {
            title: model.video_title || model.resource_heading,
            content: new SuperbVideoViewer({file: model.video_file}),
            customClass: 'reverse-colors'
        };

        event.preventDefault();
        shellBus.emit('showDialog', () => dialogProps);
    }

    return (
        <React.Fragment>
            {
                models.map((model) =>
                    <VideoResourceBox {...{model, onClick}} key={model.video_file} />
                )
            }
            {
                blogLinkModels && blogLinkModels.map((model) =>
                    <ResourceBox model={model} icon="link" key={model.heading} />
                )
            }
            {
                referenceModels.map((model) =>
                    <ResourceBox model={model} key={model.heading} />
                )
            }
        </React.Fragment>
    );
}
