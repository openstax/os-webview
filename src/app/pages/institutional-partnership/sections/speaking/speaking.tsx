import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './speaking.scss';

export type SpeakingProps = {
    heading: string;
    description: string;
    imageAlt: string;
    imageCaption: string;
    image: {
        meta: {
            downloadUrl: string;
        };
    };
};

export default function Speaking({
    heading,
    description,
    imageAlt,
    imageCaption,
    image: {
        meta: {downloadUrl: image}
    }
}: SpeakingProps) {
    return (
        <section className="speaking white">
            <div className="content-block">
                <figure className="inset-image" style={{float: 'right'}}>
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
