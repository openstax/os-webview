import React from 'react';

export default function Page() {
    return (
        <main className="not-found no-style page">
            <img
                className="strips" src="/images/components/strips.svg"
                height="10" alt="" role="presentation"
            />
            <div className="boxed">
                <h1>Uh-oh, no page here</h1>
                <p>
                    Kudos on your desire to explore! Unfortunately, we don't have a page to go
                    with that particular location.
                </p>
            </div>
        </main>
    );
}
