import React from 'react';
import ContactForm from '../shared/contact-form';
import './contact.scss';

const data = {
    heading: 'Don\'t see what you\'re looking for?',
    description: `We're here to answer any questions you may have.
    Complete the form to get in contact with a member of our team.`
};

export default function Contact() {
    return (
        <section className='contact'>
            <div className='boxed'>
                <div>
                    <h1>{data.heading}</h1>
                    <div>{data.description}</div>
                </div>
                <ContactForm />
            </div>
        </section>
    );
}
