import React from "react";
// import ContactForm from '../shared/contact-form';
import { InterestForm } from "~/pages/interest/interest";
import "./sign-up-form.scss";

export default function SignUpForm({ data }) {
    const bannerStyle = React.useMemo(
        () => ({ backgroundImage: `url(${data.rfiImage.meta.downloadUrl})` }),
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
