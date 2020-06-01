import React from 'react';
import WrappedJsx from '~/controllers/jsx-wrapper';
import './education.css';

export function Education({content, linkUrl, linkText}) {
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

export default class extends WrappedJsx {

    init(model) {
        super.init(Education, {
            content: model.content,
            linkUrl: model.link,
            linkText: model.cta
        });
    }

}
