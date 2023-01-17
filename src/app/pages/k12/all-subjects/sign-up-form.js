import React from 'react';
import ContactForm from '../shared/contact-form';
import './sign-up-form.scss';

const data = {
    heading: 'Stay in touch',
    description: `Sign up for our email newsletter to keep current with the latest
    news, textbooks, resources, and blogs.`
};

export default function SignUpForm() {
    return (
        <section className="sign-up-form boxed">
            <h1>{data.heading}</h1>
            <div>{data.description}</div>
            <ContactForm />
        </section>
    );
}

