import React from 'react';

import './cta.scss';

type CtaProps = {
    data: {
        assignableCtaText: string;
        assignableCtaLink: string;
        assignableCtaButtonText: string;
        tosLink: string;
    };
};

export default function Cta({data}: CtaProps) {
    return (
        <section className="cta green">
            <div className="content">
                <h2>{data.assignableCtaText}</h2>
                <a className="btn primary" href={data.assignableCtaLink}>
                    {data.assignableCtaButtonText}
                </a>
                <div>
                    <a href={data.tosLink}>Assignable Terms of Service</a>
                    <br />
                    <a href="/privacy">Privacy Notice</a>
                </div>
            </div>
        </section>
    );
}
