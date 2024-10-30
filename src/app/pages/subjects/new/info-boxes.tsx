import React from 'react';
import useSubjectsContext, {ImageData} from './context';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './info-boxes.scss';

export type InfoBoxValues = {
    value: {
        heading: string;
        text: string;
        image: ImageData;
    }[];
};

function AboutBlurb({image, heading, text: description}: InfoBoxValues['value'][0]) {
    return (
        <div className="container">
            <div className="blurb">
                <div>
                    <img src={image.file} role="presentation" />
                    <h3 className="title">{heading}</h3>
                </div>
                <RawHTML Tag="p" className="text" html={description} />
            </div>
        </div>
    );
}

export function InfoBoxes({infoBoxes}: {infoBoxes: InfoBoxValues['value']}) {
    return (
        <section className="info-boxes">
            <div className="content">
                {infoBoxes.map((b, i) => (
                    <AboutBlurb {...b} key={i} />
                ))}
            </div>
        </section>
    );
}

export default function InfoBoxesUsingContext() {
    const {infoBoxes} = useSubjectsContext();
    const unwrappedData = infoBoxes[0]?.value;

    return <InfoBoxes infoBoxes={unwrappedData} />;
}
