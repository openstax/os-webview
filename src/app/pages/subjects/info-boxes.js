import React from 'react';
import useSubjectsContext from './context';
import {linkClickTracker} from '~/helpers/savings-blurb';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './info-boxes.scss';

const eventName = 'Microdonation subjects page donor supported blurb impact link';

function AboutBlurb({blurb: {iconUrl, heading, description}}) {
    return (
        <div className="container">
            <div className="blurb" onClick={linkClickTracker(eventName)}>
                <div>
                    <img src={iconUrl} role="presentation" />
                    <h3 className="title">{heading}</h3>
                </div>
                <RawHTML Tag="p" className="text" html={description} />
            </div>
        </div>
    );
}

export default function InfoBoxes() {
    const {aboutBlurbs} = useSubjectsContext();

    return (
        <section className="info-boxes">
            <div className="content">
                {aboutBlurbs?.slice(0, 3).map((b, i) => <AboutBlurb blurb={b} key={i} />)}
            </div>
        </section>
    );
}
