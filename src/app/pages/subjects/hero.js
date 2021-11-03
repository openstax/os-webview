import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import useSubjectsContext from './context';
import './hero.scss';

const linesUrl = '/images/subjects/graphic-lines.svg';
const waveUrl = '/images/subjects/wave-bg.png';
const studentUrl = 'https://via.placeholder.com/328x323/?text="student sitting"';

export default function Hero() {
    const {pageDescription} = useSubjectsContext();

    return (
        <section className="hero">
            <div className="background-images">
                <img className="bg2" role="presentation" src={waveUrl} />
                <img className="bg1" role="presentation" src={linesUrl} />
            </div>
            <div className="content">
                <img className="overlapping" src={studentUrl} role="presentation" />
                <RawHTML className="text-content" html={pageDescription} />
            </div>
        </section>
    );
}
