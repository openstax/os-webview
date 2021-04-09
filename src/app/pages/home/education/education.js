import React from 'react';
import LinkWithChevron from '~/components/link-with-chevron/link-with-chevron';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './education.scss';

export default function ({content, linkUrl, linkText}) {
    return (
        <div className="education-banner">
            <div className="container">
                <div className="quote">
                    <RawHTML html={content} />
                    <LinkWithChevron href={linkUrl}>
                        {linkText}
                    </LinkWithChevron>
                </div>
                <div className="student" role="img" aria-label="student holding history book"></div>
            </div>
        </div>
    );
}
