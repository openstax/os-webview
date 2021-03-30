import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';

import './sign-up.css';

export default function SignUp({heading, contactHtml, submitUrl, buttonText}) {
    return (
        <section className="sign-up green">
            <div className="content">
                <FontAwesomeIcon icon="envelope-open" />
                <h1>{heading}</h1>
                <RawHTML className="contact" html={contactHtml} />
                <a className="btn primary" href={submitUrl}>{buttonText}</a>
            </div>
        </section>
    );
}
