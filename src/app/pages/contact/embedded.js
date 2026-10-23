import React from 'react';
import {hasOnlySlugCharacters} from '~/helpers/data';
import Form from './form';
import './embedded.scss';

// File is js because it is dynamically imported (and minimal)
export default function EmbeddedForm() {
    const [submitted, setSubmitted] = React.useState(false);
    // Set by the portal footer that opens this form, since this page is not in the portal
    const portal = new window.URLSearchParams(window.location.search).get('portal') ?? '';
    const subjectsHref = hasOnlySlugCharacters(portal) ? `/${portal}/subjects` : '/subjects';

    if (submitted) {
        return <ThankYou />;
    }

    return (
        <main id="maincontent" className="embedded-contact">
            <h1>Contact us</h1>
            <div>
                Need to suggest a content correction instead? Find the book
                on our{' '}
                {/* Our own site, so the referrer is kept; noopener is the browser default anyway */}
                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                <a href={subjectsHref} target="_blank" rel="noopener">
                    subjects page
                </a>.
                {' '}You can submit errata from the details page for the book.
            </div>
            <Form setSubmitted={setSubmitted} />
        </main>
    );
}

function ThankYou() {
    const signalDone = React.useCallback(
        () => window.parent.postMessage('CONTACT_FORM_SUBMITTED', '*'),
        []
    );

    return (
        <main id="maincontent" className="embedded-contact">
            <h1>Thanks for contacting us.</h1>
            <div>Someone from our team will follow up with you soon.</div>
            <button type="button" className="btn primary" onClick={signalDone}>
                Done
            </button>
        </main>
    );
}
