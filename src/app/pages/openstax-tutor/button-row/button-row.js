import React from 'react';
import './button-row.css';

export default function ButtonRow({model: {demoCtaLink, demoCtaText, tutorLoginLink}}) {
    const tutorLoginText = 'Log in to OpenStax Tutor';

    return (
        <div className="button-row">
            <a className="btn primary" href={demoCtaLink}>{demoCtaText}</a>
            <span>
                or{' '}
                <a href={tutorLoginLink}>{tutorLoginText}</a>
            </span>
        </div>
    );
}
