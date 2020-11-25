import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './speaking.css';

export default function Speaking({
    heading, description, imageAlt, imageCaption,
    image: {meta: {downloadUrl: image}}
}) {
    return (
        <section className="speaking white">
            <div className="content-block">
                <div className="left-group">
                    <h2 className="ul">{heading}</h2>
                    <RawHTML className="ll description-block" html={description} />
                </div>
                <img className="ur" src={image} alt={imageAlt} />
                <RawHTML className="lr caption" html={imageCaption} />
            </div>
        </section>
    );
}
