import React from 'react';
import './assistant.scss';

export default function Assistant({id, hidden}) {
    return (
        <section id={id} hidden={hidden}>
            <h2>My Assistant</h2>
        </section>
    );
}
