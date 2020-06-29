import React from 'react';

// eslint-disable-next-line complexity
export default function Quote({model}) {
    const classList = ['quote-bucket', model.image.image && model.image.alignment || 'full']
        .join(' ');
    const styleSpecs = [`background-image: url(${model.image.image})`];

    if (model.height) {
        styleSpecs.push(`height: ${model.height}px`);
    }

    return (
        <div className={classList}>
            {
                model.image.image &&
                    <div
                        className="image"
                        style={styleSpecs.join(';')}
                    />
            }
            <div className={`quote ${model.colorScheme || ''}`}>
                <blockquote>
                    <quote-html dangerouslySetInnerHTML={{__html: model.content}} />
                    {
                        Boolean(model.attribution) &&
                            <div className="attribution">— {model.attribution}</div>
                    }
                </blockquote>
                {
                    Boolean(model.overlay) &&
                        <img className="overlay" src={model.overlay} alt={model.alt_text} />
                }
                {
                    Boolean(model.cta) &&
                        <a className="btn btn-orange" href={model.link}>{model.cta}</a>
                }
            </div>
        </div>
    );
}
