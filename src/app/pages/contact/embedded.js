import React from 'react';
import Form from './form';
import './embedded.scss';

// File is js because it is dynamically imported (and minimal)
export default function EmbeddedForm() {
    const [submitted, setSubmitted] = React.useState(false);

    if (submitted) {
        return <ThankYou />;
    }

    return (
        <main id="maincontent" className="embedded-contact">
            <h1>Report an issue</h1>
            <div>
                Need to suggest a content correction instead? Fill out the{' '}
                <a href="/errata" target="_blank">
                    errata form
                </a>
                .
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
