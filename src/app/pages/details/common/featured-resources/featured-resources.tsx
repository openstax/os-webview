import React from 'react';
import ResourceBoxes, {ResourceModel} from '../resource-box/resource-boxes';
import {FormattedMessage} from 'react-intl';
import './featured-resources.scss';

type ResourcesProps = {
    header: string | null;
    models: ResourceModel[];
    'data-analytics-content-list': string;
};

function FeaturedResources({header, models, ...props}: ResourcesProps) {
    const modResources = models.map((res) => {
        const storageKey = `featured-resource-${res.heading}`;
        const seenTimes = 1 + Number(window.localStorage[storageKey] || 0);
        const model = Object.assign(
            {
                isNew: seenTimes <= 3
                // There was an onClick defined here that nothing used
            },
            res
        );

        window.localStorage[storageKey] = seenTimes;

        return model;
    });

    return (
        <div className="card">
            <div className="headline">{header}</div>
            <div
                data-analytics-content-list={
                    props['data-analytics-content-list']
                }
                className="resources"
            >
                <ResourceBoxes models={modResources} />
            </div>
        </div>
    );
}

export default function FeaturedResourcesSection({
    header,
    models,
    ...props
}: ResourcesProps) {
    return (
        <div>
            <div className="featured-resources">
                <FeaturedResources header={header} models={models} {...props} />
            </div>
            <div className="divider">
                <div className="line"></div>
                <FormattedMessage
                    id="resources.additional"
                    defaultMessage="see additional resources below"
                />
                <div className="line"></div>
            </div>
        </div>
    );
}
