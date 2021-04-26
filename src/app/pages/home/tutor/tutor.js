import React from 'react';
import './tutor.scss';

function Buttons() {
    return (
        <div className="buttons">
            <a className="btn primary">About OpenStax Tutor</a>
            <a className="btn">Schedule a demo</a>
        </div>
    );
}

function IconGroup({icon, text}) {
    return (
        <div className="icon-group">
            <img src={icon} alt />
            {text}
        </div>
    );
}

export default function ComponentTemplate({data}) {
    return (
        <section className="tutor">
            <div className="boxed">
                <div className="text-block">
                    <img src={data.logoUrl} alt="OpenStax Tutor" />
                    <div>{data.description}</div>
                    <Buttons />
                </div>
                <div className="icon-block">
                    <IconGroup icon={data.homeworkIcon} text={data.homeworkText} />
                    <IconGroup icon={data.analyticsIcon} text={data.analyticsText} />
                    <IconGroup icon={data.readingIcon} text={data.readingText} />
                    <IconGroup icon={data.lmsIcon} text={data.lmsText} />
                </div>
            </div>
        </section>
    );
}
