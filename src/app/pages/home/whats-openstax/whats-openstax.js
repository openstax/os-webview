import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart} from '@fortawesome/free-solid-svg-icons/faHeart';
import ClippedImage from '~/components/clipped-image/clipped-image';
import './whats-openstax.scss';

function Buttons({giveLink, giveText, learnMoreLink, learnMoreText}) {
    return (
        <div className="buttons">
            <a className="btn" href={giveLink}>
                <span>
                    {giveText}{' '}
                    <FontAwesomeIcon icon={faHeart} />
                </span>
            </a>
            <a href={learnMoreLink}>{learnMoreText}</a>
        </div>
    );
}

export default function ComponentTemplate({data}) {
    return (
        <section className="whats-openstax">
            <div className="half-boxed">
                <ClippedImage src={data.image} alt="" />
                <div className="text-block">
                    <h2>{data.headline}</h2>
                    <div>{data.description}</div>
                    <div>{data.donateText}</div>
                    <Buttons
                        giveLink={data.giveLink}
                        giveText={data.giveText}
                        learnMoreLink={data.learnMoreLink}
                        learnMoreText={data.learnMoreText}
                    />
                </div>
            </div>
        </section>
    );
}
