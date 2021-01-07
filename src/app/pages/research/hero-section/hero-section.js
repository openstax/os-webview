import React, {useState} from 'react';
import './hero-section.css';

export default function HeroSection({data: {missionBody, missionHeader}}) {
    return (
        <section className="hero-section">
            <div className="content">
                <div>
                    <h1>{missionHeader}</h1>
                    <div>{missionBody}</div>
                </div>
            </div>
            <div className="images" role="presentation">
                <div className="globe-clipping">
                    <img src="/images/research/hero-research-earth@1x.png" alt="" />
                </div>
                <div className="clipping">
                    <img src="/images/research/hero-research-curves.svg" alt="" />
                </div>
            </div>
        </section>
    );
}
