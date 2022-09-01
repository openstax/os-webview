import React from 'react';
import useSubjectsContext from './context';
import {linkClickTracker} from '~/helpers/savings-blurb';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './info-boxes.scss';

const eventName = 'Microdonation subjects page donor supported blurb impact link';

function AboutBlurb({image, heading, text: description}) {
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

export function InfoBoxes({infoBoxes=[]}) {
    return (
        <section className="info-boxes">
            <div className="content">
                {infoBoxes.map((b, i) => <AboutBlurb {...b} key={i} />)}
            </div>
        </section>
    );
}

export default function InfoBoxesUsingContext() {
    const {infoBoxes} = useSubjectsContext();
    const unwrappedData = infoBoxes[0].value;

    return (<InfoBoxes infoBoxes={unwrappedData} />);
}
