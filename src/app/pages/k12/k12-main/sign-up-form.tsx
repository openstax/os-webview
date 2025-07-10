import React from 'react';
// import ContactForm from '../shared/contact-form';
import {InterestForm} from '~/pages/interest/interest';
import './sign-up-form.scss';
import {K12Data} from './k12-main';

export default function SignUpForm({data}: {data: K12Data}) {
    const bannerStyle = React.useMemo(
        () => ({backgroundImage: `url(${data.rfiImage.meta.downloadUrl})`}),
        [data]
    );

    return (
        <section className="sign-up-form">
            <div className="banner" style={bannerStyle} />
            <div className="boxed">
                <h1>{data.rfiHeader}</h1>
                <div>{data.rfiDescription}</div>
                <InterestForm role="K12 Instructor" />
            </div>
        </section>
    );
}
