import React from 'react';
import ContactForm from '../shared/contact-form';
import './contact.scss';

export default function Contact({data}) {
    return (
        <section className='contact'>
            <div className='boxed'>
                <div>
                    <h1>{data.rfiHeading}</h1>
                    <div>{data.rfiText}</div>
                </div>
                <ContactForm />
            </div>
        </section>
    );
}
