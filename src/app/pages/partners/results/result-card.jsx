import React, {useState} from 'react';

export default function ({model, emitSelect}) {
    return (
        <a href={`#${model.title}`} type="button" className="card" onClick={emitSelect}>
            <div className="logo">
                {
                    model.logoUrl && <img src={model.logoUrl} alt="" />
                }
            </div>
            {
                model.verifiedFeatures &&
                <div className="badge">
                    <img className="background" src={model.badgeImage} alt="verified" />
                    <i className="checkmark fa fa-check"></i>
                    <div className="tooltip top">
                        {model.verifiedFeatures}
                    </div>
                </div>
            }
            <div className="resource-title">{model.title}</div>
            <div className="resource-description">{model.description}</div>
            <div className="tags">
                {
                    model.tags.map((entry) =>
                        <span key={entry.value}>{entry.label}: {entry.value}</span>
                    )
                }
            </div>
        </a>
    );
}
