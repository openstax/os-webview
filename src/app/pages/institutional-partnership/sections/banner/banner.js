import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './banner.scss';

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
