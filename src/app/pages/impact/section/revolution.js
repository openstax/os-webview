import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './revolution.css';

function Letter({heading, letterBody, portrait, signatureImage, signatureText}) {
    return (
        <div className="text-block">
            <h2>{heading}</h2>
            <RawHTML html={letterBody} className="text-block" />
            <div className="signature-section">
                <img className="mobile-only little-headshot"
                    src={portrait.image} alt={portrait.altText}
                />
                <div>
                    <img className="signature-image" src={signatureImage.image}
                        alt={signatureImage.altText}
                    />
                    <RawHTML html={signatureText} />
                </div>
            </div>
        </div>
    );
}

export default function Revolution({portrait, ...letterProps}) {
    return (
        <section id="revolution" className="light">
            <div className="revolution content">
                <div className="text-left-photo-right">
                    <Letter portrait={portrait} {...letterProps} />
                    <img className="hide-on-mobile" src={portrait.image} alt={portrait.altText} />
                </div>
            </div>
        </section>
    );
}
