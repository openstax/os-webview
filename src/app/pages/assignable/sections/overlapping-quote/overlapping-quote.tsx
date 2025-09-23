import React from 'react';
import './overlapping-quote.scss';

type OverlappingQuoteProps = {
    data: {
        addAssignableCtaHeader: string;
        addAssignableCtaDescription: string;
        addAssignableCtaLink: string;
        addAssignableCtaButtonText: string;
    };
};

export default function OverlappingQuote({
    data: {
        addAssignableCtaHeader: header,
        addAssignableCtaDescription: description,
        addAssignableCtaLink: url,
        addAssignableCtaButtonText: buttonText
    }
}: OverlappingQuoteProps) {
    return (
        <section className="overlapping-quote near-white">
            <div className="overlapping">
                <div className="quote-box">
                    <div className="text-block">
                        <h1>{header}</h1>
                        <div className="description">{description}</div>
                        <a className="btn primary" href={url}>{buttonText}</a>
                    </div>
                </div>
            </div>
        </section>
    );
}