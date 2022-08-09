import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEnvelopeOpen} from '@fortawesome/free-regular-svg-icons/faEnvelopeOpen';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';

import './sign-up.scss';

export default function SignUp({heading, contactHtml, submitUrl, buttonText}) {
    return (
        <section className="sign-up green">
            <div className="content">
                <FontAwesomeIcon className="envelope-icon" icon={faEnvelopeOpen} />
                <h2>{heading}</h2>
                <RawHTML className="contact" html={contactHtml} />
                <a className="btn primary" href={submitUrl}>{buttonText}</a>
            </div>
        </section>
    );
}
