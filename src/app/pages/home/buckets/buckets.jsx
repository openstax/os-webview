import React from 'react';
import LinkWithChevron from '../link-with-chevron/link-with-chevron';
import './buckets.css';

function Bucket({model}) {
    const classList = ['bucket', model.bucketClass, model.image.alignment].join(' ');

    return (
        <div className={classList}>
            {
                model.hasImage &&
                    <div className="image"
                        role="img" aria-label={model.image.alt_text || 'need alt text'}
                        style={`background-image: url('${model.image.image}')`}
                    />
            }
            <div className="quote">
                <div>
                    <span className="title">{model.heading}</span>
                    <blurb-html className="blurb" dangerouslySetInnerHTML={{__html: model.content}} />
                </div>
                <LinkWithChevron href={model.link} children={model.cta} />
            </div>
        </div>
    );
}

export default function ({bucketModels}) {
    return (
        <div className="buckets-section">
            {
                bucketModels.map((model) =>
                    <Bucket model={model} />
                )
            }
        </div>
    );
}
