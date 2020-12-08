import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './sign-up.css';

export default function SignUp({heading, contactHtml, submitUrl, buttonText}) {
    return (
        <section className="sign-up green">
            <div className="content">
                <span className="envelope-icon far fa-envelope-open"></span>
                <h1>{heading}</h1>
                <RawHTML className="contact" html={contactHtml} />
                <a className="btn primary" href={submitUrl}>{buttonText}</a>
            </div>
        </section>
    );
}
