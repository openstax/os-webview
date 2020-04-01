import React, {useState} from 'react';
import ResourceBoxes from '../../resource-box/resource-boxes.jsx';
import './featured-resources.css';

export default function ({headline, resources}) {
    return (
        <div className="card">
            <div className="headline">
                {headline}
            </div>
            <div className="resources">
                <ResourceBoxes models={resources} />
            </div>
        </div>
    );
}
