import React from 'react';
import {Document} from '~/components/jsx-helpers/jsx-helpers.jsx';

export default function Page() {
    return (
        <main className="not-found no-style page">
            <Document title="404 Not Found - OpenStax" noindex />
            <img
                className="strips" src="/dist/images/components/strips.svg"
                height="10" alt="" role="presentation"
            />
            <div className="boxed">
                <h1>Uh-oh, no page here</h1>
                <p>
                    Kudos on your desire to explore! Unfortunately, we don&apos;t have a page to go
                    with that particular location.
                </p>
            </div>
        </main>
    );
}
