import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import ResourceBox from './resource-box';
import useDetailsContext from '../../context';
import './resource-box.scss';

function CommonsHubBox() {
    const {
        communityResourceHeading: heading,
        communityResourceLogoUrl: logoUrl,
        communityResourceUrl: url,
        communityResourceCta: cta,
        communityResourceBlurb: blurb,
        communityResourceFeatureLinkUrl: featureUrl,
        communityResourceFeatureText: featureText
    } = useDetailsContext();

    if (!url) {
        return null;
    }

    return (
        <div className="resource-box double">
            <div className="top-line">
                <h3>{heading}</h3>
                <img src={logoUrl} alt="" />
            </div>
            <div className="blurb">
                <RawHTML Tag="span" html={blurb} />
                <br />
                <a href={url}>
                    {cta} <FontAwesomeIcon icon={faExternalLinkAlt} />
                </a>
            </div>
            <div className="bottom">
                <div className="right">
                    {featureUrl && <a href={featureUrl}>{featureText}</a>}
                </div>
            </div>
        </div>
    );
}

export default function ResourceBoxes({ models, includeCommonsHub = false }: {
    models: {heading: string;
    }[]; // Will be a real type when other stuff becomes TS
    includeCommonsHub?: boolean;
}) {
    return (
        <React.Fragment>
            {includeCommonsHub && <CommonsHubBox />}
            {models.map((model) => (
                <ResourceBox model={model} key={model.heading} />
            ))}
        </React.Fragment>
    );
}

