import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';

import './sign-up.scss';

export default function SignUp({
    data: {
        tosHeading = 'This is text that should from the CMS',
        contactHtml = 'This is HTML that <i>should</i> come from the CMS',
        tosLink: submitUrl,
        buttonText = 'Link text non-CMS'
    }
}) {
    return (
        <section className="sign-up green">
            <div className="content">
                <h2>{tosHeading}</h2>
                <RawHTML className="contact" html={contactHtml} />
                <a className="btn primary" href={submitUrl}>{buttonText}</a>
            </div>
        </section>
    );
}
