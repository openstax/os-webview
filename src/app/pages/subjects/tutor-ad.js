import React from 'react';
import './tutor-ad.scss';

export default function TutorAd() {
    return (
        <section className="tutor-ad">
            <div className="content">
                <div className="unclipped">
                    <div className="box-with-edge">
                        <div className="rainbow-edge" />
                    </div>
                    <div className="box-contents">
                        <div className="overlapping-image">
                            <img role="presentation" src="/images/subjects/tutor-computer.png" />
                        </div>
                        <div className="block-of-text">
                            Improve student engagement with immersive digital readings
                            and online assignments for your students.
                        </div>
                        <a className="btn primary">Learn more</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
