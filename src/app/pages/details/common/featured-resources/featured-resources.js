import React from 'react';
import ResourceBoxes from '../resource-box/resource-boxes';
import './featured-resources.scss';

export default function FeaturedResources({headline, resources}) {
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
            <div className="resources">
                <ResourceBoxes models={modResources} />
            </div>
        </div>
    );
}
