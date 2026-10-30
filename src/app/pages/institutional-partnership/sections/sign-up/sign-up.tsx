import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEnvelopeOpen} from '@fortawesome/free-regular-svg-icons/faEnvelopeOpen';
import RawHTML from '~/components/jsx-helpers/raw-html';
import usePortalContext from '~/contexts/portal';

import './sign-up.scss';

export type SignUpProps = {
    heading: string;
    contactHtml: string;
    submitUrl: string;
    buttonText: string;
};

export default function SignUp({
    heading,
    contactHtml,
    submitUrl,
    buttonText
}: SignUpProps) {
    const {hrefInPortal} = usePortalContext();

    return (
        <section className="sign-up green">
            <div className="content">
                <FontAwesomeIcon
                    className="envelope-icon"
                    icon={faEnvelopeOpen}
                />
                <h2>{heading}</h2>
                <RawHTML className="contact" html={contactHtml} />
                <a className="btn primary" href={hrefInPortal(submitUrl)}>
                    {buttonText}
                </a>
            </div>
        </section>
    );
}
