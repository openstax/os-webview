import React from 'react';
import LinkWithChevron from '~/components/link-with-chevron/link-with-chevron';
import './education.css';

export default function ({content, linkUrl, linkText}) {
    return (
        <div className="education-banner">
            <div className="container">
                <div className="quote">
                    <div dangerouslySetInnerHTML={{__html: content}} />
                    <LinkWithChevron href={linkUrl}>
                        {linkText}
                    </LinkWithChevron>
                </div>
                <div className="student" role="img" aria-label="student holding history book"></div>
            </div>
        </div>
    );
}
