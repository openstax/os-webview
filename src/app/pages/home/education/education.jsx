import React from 'react';
import './education.css';

export default function ({content, linkUrl, linkText}) {
    return (
        <div className="education-banner">
            <div className="container">
                <div className="quote">
                    <div dangerouslySetInnerHTML={{__html: content}}/>
                    <a className="btn primary" href={linkUrl}>{linkText}</a>
                </div>
                <div className="student" role="img" aria-label="student holding history book"></div>
            </div>
        </div>
    );
}
