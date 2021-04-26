import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import ClippedImage from '~/components/clipped-image/clipped-image';
import './banner.scss';

function Buttons() {
    return (
        <div className="buttons">
            <a className="btn primary">Get started now</a>
            <a className="btn">Login</a>
        </div>
    );
}

export default function Banner({data}) {
    return (
        <section className="banner">
            <img className="left-bg" src={data.leftImage} alt />
            <div className="boxed">
                <div className="text-block">
                    <h1>{data.headline}</h1>
                    <RawHTML html={data.description} />
                    <Buttons />
                </div>
            </div>
            <ClippedImage className="right-bg" src={data.rightImage} alt="" />
        </section>
    );
}
