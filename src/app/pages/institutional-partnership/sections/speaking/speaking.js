import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './speaking.scss';

export default function Speaking({
    heading, description, imageAlt, imageCaption,
    image: {meta: {downloadUrl: image}}
}) {
    return (
        <section className="speaking white">
            <div className="content-block">
                <figure className="inset-image" style="float:right">
                    <img src={image} alt={imageAlt} />
                    <RawHTML Tag="figcaption" html={imageCaption} />
                </figure>
                <div className="left-group">
                    <h2>{heading}</h2>
                    <RawHTML className="description-block" html={description} />
                </div>
            </div>
        </section>
    );
}
