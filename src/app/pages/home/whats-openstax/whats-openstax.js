import React from 'react';
import ClippedImage from '~/components/clipped-image/clipped-image';
import './whats-openstax.scss';

export default function WhatsOpenStax({data}) {
    return (
        <section className="whats-openstax">
            <div className="half-boxed">
                <ClippedImage src={data.image} alt="" />
                <div className="text-block">
                    <h2>{data.headline}</h2>
                    <div>{data.description}</div>
                    <div className="closer-grouping">
                        <div>
                            <h3>Interested in using OpenStax?</h3>
                            <div>{data.donateText}</div>
                        </div>
                        <a href="/interest" className="btn secondary">I’m interested!</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
