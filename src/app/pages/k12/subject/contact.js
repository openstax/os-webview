import React from 'react';
// import ContactForm from '../shared/contact-form';
import { InterestForm } from '~/pages/interest/interest';
import './contact.scss';

export default function Contact({ data }) {
    return (
        <section id="contact">
            <div className="boxed">
                <div>
                    <h1>{data.rfiHeading}</h1>
                    <div>{data.rfiText}</div>
                </div>
                <InterestForm role="K12 Instructor" />
            </div>
        </section>
    );
}
