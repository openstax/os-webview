import React from 'react';
import useOptimizedImage, {
    maxDimIfNarrowerThan
} from '~/helpers/use-optimized-image';
import './big-quote.scss';

export type BigQuoteProps = {
    text: string;
    name: string;
    title: string;
    school: string;
    backgroundImage: string;
};

export default function BigQuote({
    text,
    name,
    title,
    school,
    backgroundImage
}: BigQuoteProps) {
    const maxDim = maxDimIfNarrowerThan(1920);
    const optimizedImage = useOptimizedImage(backgroundImage, maxDim);

    return (
        <section className="big-quote">
            <div
                className="background-image"
                style={{backgroundImage: `url(${optimizedImage})`}}
            />
            <div className="gradient-overlay" />
            <div className="content">
                <div className="big-quote-mark">&quot;</div>
                <div className="text-block">
                    <div className="quote">{text}</div>
                    <div className="name">- {name}</div>
                    <div className="title">{title}</div>
                    <div className="school">{school}</div>
                </div>
            </div>
        </section>
    );
}
