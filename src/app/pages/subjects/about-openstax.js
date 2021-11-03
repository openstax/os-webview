import React from 'react';
import './about-openstax.scss';

const heading = 'About OpenStax textbooks';
const paragraph = `OpenStax is part of Rice University, a 501(c)(3) nonprofit charitable
corporation. As an educational initiative, it's our mission to transform learning so
that education works for every student. We are improving access to education for
millions of learners by publishing high-quality, peer-reviewed, openly licensed
college textbooks that are available free online. We currently offer 10 free business
textbooks, and our library is only growing: Business Ethics, Business Law I Essentials,
Entrepreneurship, Introduction to Business, Introduction to Intellectual Property,
Introductory Business Statistics, Organizational Behavior, Principles of Accounting,
Volume 1: Financial Accounting, Principles of Accounting, Volume 2: Managerial
Accounting, and Principles of Management.`;
const buttonText = 'Learn about OpenStax';
const buttonUrl = '/about';
const imgSrc = 'https://via.placeholder.com/330x293';

export default function AboutOpenStax() {
    return (
        <section className="about-openstax">
            <div className="content">
                <h2>{heading}</h2>
                <div>{paragraph}</div>
                <a className="btn primary" href={buttonUrl}>{buttonText}</a>
                <img src={imgSrc} />
            </div>
        </section>
    );
}
