import React from 'react';
import './common.css';

export function LabeledSection({headerLabel, headline, children}) {
    return (
        <section className="labeled-section">
            <div className="content">
                <header>{headerLabel}</header>
                <h1 className="section-label">{headline}</h1>
                {children}
            </div>
        </section>
    );
}
