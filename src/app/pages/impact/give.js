import React, {useState} from 'react';
import './give.css';

const nonprofitText = `As a part of Rice University, a 501(c)(3) nonprofit, gifts
to OpenStax are tax deductible to the fullest extent allowed by law. Our tax ID
number is 74-1109620.`;
const reportLinkText = 'Read our latest Annual Report';
const reportLinkUrl = '/somewhere';

export default function Give({
    model: {
        heading, description, link, linkText
    }
}) {
    return (
        <section className="give-section">
            <div className="text-content">
                <h2>{heading}</h2>
                <div>{description}</div>
                <a className="btn primary" href={link}>
                    {linkText}
                </a>
                <div className="nonprofit-statement">{nonprofitText}</div>
                <a href={reportLinkUrl}>{reportLinkText}</a>
            </div>
        </section>
    );
}
