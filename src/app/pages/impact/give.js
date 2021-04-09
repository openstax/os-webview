import React from 'react';
import './give.scss';

export default function Give({
    model: {
        heading, description, linkHref, linkText,
        nonprofitStatement,
        annualReportLinkHref, annualReportLinkText
    }
}) {
    return (
        <section className="give-section">
            <div className="text-content">
                <h2>{heading}</h2>
                <div>{description}</div>
                <a className="btn primary" href={linkHref}>
                    {linkText}
                </a>
                <div className="nonprofit-statement">{nonprofitStatement}</div>
                <a href={annualReportLinkHref}>{annualReportLinkText}</a>
            </div>
        </section>
    );
}
