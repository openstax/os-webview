import React, {useState} from 'react';
import ResourceBoxes from '../../resource-box/resource-boxes.jsx';
import './featured-resources.css';

export default function FeaturedResources({headline, resources}) {
    const modResources = resources.map((res) => {
        const storageKey = `featured-resource-${res.heading}`;
        const seenTimes = 1 + Number(localStorage[storageKey] || 0);
        const model = Object.assign({
            isNew: seenTimes <= 3,
            onClick: () => {
                localStorage[storageKey] = 5;
                model.isNew = false;
            }
        }, res);

        localStorage[storageKey] = seenTimes;

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
