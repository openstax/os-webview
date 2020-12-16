import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import css from './banner.css';

export default function Banner({
    heading, description, linkText, link,
    backgroundImage: {meta: {downloadUrl: backgroundImage}}
}) {
    return (
        <section className="banner">
            <div className="background-image" style={{backgroundImage: `url(${backgroundImage})`}} />
            <div className="content-block">
                <h1>{heading}</h1>
                <RawHTML html={description} />
                <a className="btn primary" href={link}>{linkText}</a>
            </div>
        </section>
    );
}
