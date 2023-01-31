import React from 'react';
import Banner from './banner';
import Features from './features';
import StatsGrid from './stats-grid';
import Subjects from './subjects';
import Testimonial from './testimonial';
import FAQ from './faq';
import SignUpForm from './sign-up-form';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import './all-subjects.scss';

function K12({data}) {
    React.useEffect(
        () => console.info('DATA', data),
        [data]
    );

    return (
        <div className="k12 page">
            <Banner data={data} />
            <Features data={data} />
            <StatsGrid data={data} />
            <Subjects data={data} />
            <Testimonial data={data} />
            <FAQ data={data} />
            <SignUpForm data={data} />
        </div>
    );
}

export default function K12Loader() {
    return (
        <LoaderPage slug="pages/k12" Child={K12} doDocumentSetup />
    );
}
