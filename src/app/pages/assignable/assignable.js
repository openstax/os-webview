import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import LazyLoad from 'react-lazyload';
import Banner from './sections/banner/banner';
import OverlappingQuote from './sections/overlapping-quote/overlapping-quote';
import About from './sections/about/about';
import Courses from './sections/courses/courses';
import FAQ from './sections/faq/faq';
import Cta from './sections/cta/cta';
import './assignable.scss';

function Assignable({data}) {
    return (
        <React.Fragment>
            <Banner data={data} />
            <OverlappingQuote data={data} />
            <About data={data} />
            <LazyLoad>
                <Courses data={data} />
                <FAQ data={data} />
            </LazyLoad>
            <LazyLoad>
                <Cta data={data} />
            </LazyLoad>
        </React.Fragment>
    );
}

const slug = 'pages/assignable';

export default function PageLoader() {
    return (
        <main className="assignable page">
            <LoaderPage slug={slug} Child={Assignable} doDocumentSetup />
        </main>
    );
}
