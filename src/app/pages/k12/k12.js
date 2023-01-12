import React from 'react';
import Banner from './banner';
import ThreeCards from './three-cards';
import StatsGrid from './stats-grid';
import Subjects from './subjects';
import Testimonial from './testimonial';
import FAQ from './faq';
import SignUpForm from './sign-up-form';
import './k12.scss';

function K12() {
    return (
        <div className="k-12 page">
            <Banner />
            <ThreeCards data={{}} />
            <StatsGrid />
            <Subjects />
            <Testimonial />
            <FAQ />
            <section className="footer-banner" />
            <SignUpForm />
        </div>
    );
}

export default function K12Loader() {
    return (
        <K12 data={{}} />
    );
}
