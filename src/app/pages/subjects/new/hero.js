import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import useSubjectsContext from './context';
import ClippedImage from '~/components/clipped-image/clipped-image';
import './hero.scss';

const linesUrl = '/dist/images/subjects/graphic-lines.svg';
const waveUrl = '/dist/images/subjects/wave-bg.png';

export default function Hero() {
    const {heading, description, headingImage} = useSubjectsContext();

    return (
        <section className="hero">
            <div className="background-images">
                <img className="bg2" role="presentation" src={waveUrl} />
                <img className="bg1" role="presentation" src={linesUrl} />
            </div>
            <ClippedImage
                className="overlapping" src={headingImage.meta.downloadUrl} alt=""
            />
            <div className="content">
                <h1>{heading}</h1>
                <RawHTML className="text-content" html={description} />
            </div>
        </section>
    );
}
