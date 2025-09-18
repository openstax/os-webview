import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useOptimizedImage from '~/helpers/use-optimized-image';
import './banner.scss';

export type BannerProps = {
    heading: string;
    description: string;
    linkText: string;
    link: string;
    backgroundImage: {
        meta: {
            downloadUrl: string;
        };
    };
};

export default function Banner({
    heading, description, linkText, link,
    backgroundImage: {meta: {downloadUrl: backgroundImage}}
}: BannerProps) {
    const maxDim = window.innerWidth < 1920 ? 1920 : undefined;
    const optimizedImage = useOptimizedImage(backgroundImage, maxDim);

    return (
        <section className="banner">
            <div className="background-image" style={{backgroundImage: `url(${optimizedImage})`}} />
            <div className="content-block">
                <h1>{heading}</h1>
                <RawHTML html={description} />
                <a className="btn primary" href={link}>{linkText}</a>
            </div>
        </section>
    );
}
