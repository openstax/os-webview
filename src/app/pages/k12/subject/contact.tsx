import React from 'react';
// import ContactForm from '../shared/contact-form';
import {InterestForm} from '~/pages/interest/interest';
import {K12SubjectData} from './subject';
import './contact.scss';

export default function Contact({data}: {data: K12SubjectData}) {
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
