import React from 'react';
import LeftContent from './left-content';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShoppingCart} from '@fortawesome/free-solid-svg-icons/faShoppingCart';
import type {ResourceModel} from './resource-boxes';
import cn from 'classnames';

export default function ResourceBox({model}: {model: ResourceModel}) {
    const classNames = {
        double: model.double,
        'coming-soon': model.comingSoon
    };

    return (
        <div className={cn('resource-box', classNames)}>
            <ReferenceNumber referenceNumber={model.videoReferenceNumber} />
            <Top model={model} />
            <Bottom model={model} />
        </div>
    );
}


function Top({model}: {model: ResourceModel}) {
    const description = model.comingSoon
        ? `<p>${model.comingSoonText}</p>`
        : (model.description as string);

    return (
        <div className="top">
            {model.isNew && <NewLabel />}
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

function ReferenceNumber({referenceNumber}: {referenceNumber?: number | null}) {
    return (
        referenceNumber !== undefined && referenceNumber !== null && (
            <div className="reference-number">{referenceNumber}</div>
        )
    );
}

function Bottom({model}: {model: ResourceModel}) {
    if (model.comingSoon && model.iconType === 'lock') {
        return null;
    }
    return (
        <div className="bottom">
            <LeftContent model={model} />
            {model.printLink && (
                <a className="print-link" aria-label="Buy print" href={model.printLink}>
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
