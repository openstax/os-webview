import React from 'react';
import useSubjectsContext from './context';
import {linkClickTracker} from '~/helpers/savings-blurb';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './info-boxes.scss';

const eventName = 'Microdonation subjects page donor supported blurb impact link';

function AboutBlurb({blurb: {image, heading, text: description}}) {
    return (
        <div className="container">
            <div className="blurb" onClick={linkClickTracker(eventName)}>
                <div>
                    <img src={image.file} role="presentation" />
                    <h3 className="title">{heading}</h3>
                </div>
                <RawHTML Tag="p" className="text" html={description} />
            </div>
        </div>
    );
}

export default function InfoBoxes() {
    const {infoBoxes} = useSubjectsContext();

    return (
        <section className="info-boxes">
            <div className="content">
                {infoBoxes[0].value.map((b, i) => <AboutBlurb blurb={b} key={i} />)}
            </div>
        </section>
    );
}
