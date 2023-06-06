import React from 'react';
import ResourceBoxes from '../resource-box/resource-boxes';
import {FormattedMessage} from 'react-intl';
import './featured-resources.scss';

function FeaturedResources({headline, resources, ...props}) {
    const modResources = resources.map((res) => {
        const storageKey = `featured-resource-${res.heading}`;
        const seenTimes = 1 + Number(window.localStorage[storageKey] || 0);
        const model = Object.assign({
            isNew: seenTimes <= 3,
            onClick: () => {
                window.localStorage[storageKey] = 5;
                model.isNew = false;
            }
        }, res);

        window.localStorage[storageKey] = seenTimes;

        return model;
    });

    return (
        <div className="card">
            <div className="headline">
                {headline}
            </div>
            <div
                data-analytics-content-list={props['data-analytics-content-list']}
                className="resources"
            >
                <ResourceBoxes models={modResources} />
            </div>
        </div>
    );
}

export default function FeaturedResourcesSection({header, models, ...props}) {
    return (
        <div>
            <div className="featured-resources">
                <FeaturedResources headline={header} resources={models} {...props} />
            </div>
            <div className="divider">
                <div className="line"></div>
                <FormattedMessage id="resources.additional" defaultMessage="see additional resources below" />
                <div className="line"></div>
            </div>
        </div>
    );
}
