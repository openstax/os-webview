import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import useSubjectsContext from './context';
import './hero.scss';

const linesUrl = '/images/subjects/graphic-lines.svg';
const waveUrl = '/images/subjects/wave-bg.png';

export default function Hero() {
    const {heading, description, headingImage} = useSubjectsContext();

    return (
        <section className="hero">
            <div className="background-images">
                <img className="bg2" role="presentation" src={waveUrl} />
                <img className="bg1" role="presentation" src={linesUrl} />
            </div>
            <div className="content">
                <h1>{heading}</h1>
                <img className="overlapping" src={headingImage.meta.downloadUrl} role="presentation" />
                <RawHTML className="text-content" html={description} />
            </div>
        </section>
    );
}
