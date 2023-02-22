import React from 'react';
import Banner from './banner';
import Features from './features';
import StatsGrid from './stats-grid';
import Subjects from './subjects';
import Testimonial from './testimonial';
import FAQ from './faq';
import SignUpForm from './sign-up-form';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import LazyLoad from 'react-lazyload';
import './all-subjects.scss';

function K12({data}) {
    return (
        <div className="k12 page">
            <Banner data={data} />
            <Features data={data} />
            <LazyLoad once offset={100} height={400}>
                <StatsGrid data={data} />
            </LazyLoad>
            <LazyLoad once offset={100} height={400}>
                <Subjects data={data} />
            </LazyLoad>
            <LazyLoad once offset={100} height={400}>
                <Testimonial data={data} />
            </LazyLoad>
            <FAQ data={data} />
            <LazyLoad once offset={100} height={400}>
                <SignUpForm data={data} />
            </LazyLoad>
        </div>
    );
}

export default function K12Loader() {
    return (
        <LoaderPage slug="pages/k12" Child={K12} doDocumentSetup />
    );
}
