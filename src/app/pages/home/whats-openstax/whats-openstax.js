import React from 'react';
import ClippedImage from '~/components/clipped-image/clipped-image';
import useOptimizedImage from '~/helpers/use-optimized-image';
import './whats-openstax.scss';

export default function WhatsOpenStax({data}) {
    const image = useOptimizedImage(data.image, 960);

    return (
        <section className="whats-openstax">
            <div className="half-boxed">
                <ClippedImage src={image} alt="" />
                <div className="text-block">
                    <h2>{data.headline}</h2>
                    <div>{data.description}</div>
                    <div className="closer-grouping">
                        <div>
                            <h3>Interested in using OpenStax?</h3>
                            <div>{data.interestText}</div>
                        </div>
                        <a href="/interest" className="btn secondary">I’m interested!</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
