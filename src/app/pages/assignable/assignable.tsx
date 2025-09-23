import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import LazyLoad from '~/components/jsx-helpers/lazy-load';
import './assignable.scss';

const Banner = React.lazy(() => import('./sections/banner/banner'));
const About = React.lazy(() => import('./sections/about/about'));
const Courses = React.lazy(() => import('./sections/courses/courses'));
const FAQ = React.lazy(() => import('./sections/faq/faq'));
const OverlappingQuote = React.lazy(() => import('./sections/overlapping-quote/overlapping-quote'));
const CTA = React.lazy(() => import('./sections/cta/cta'));

type ImageMeta = {
    meta: {
        downloadUrl: string;
    };
};

type CarouselImage = {
    image: {
        file: string;
        height: number;
        width: number;
        title: string;
        id: string;
    };
};

type BookData = {
    cover: string;
    title: string;
};

type FAQItem = {
    question: string;
    answer: string;
};

type AssignablePageData = {
    headingTitleImageUrl: string;
    subheading: string;
    headingDescription: string;
    headingImage: ImageMeta;
    section2Heading: string;
    section2Description: string;
    imageCarousel: [CarouselImage[]];
    availableCoursesHeader: string;
    availableBooks: BookData[];
    coursesComingSoonHeader: string;
    comingSoonBooks: BookData[];
    faqHeader: string;
    faqs: FAQItem[];
    addAssignableCtaHeader: string;
    addAssignableCtaDescription: string;
    addAssignableCtaLink: string;
    addAssignableCtaButtonText: string;
    assignableCtaText: string;
    assignableCtaLink: string;
    assignableCtaButtonText: string;
    tosLink: string;
};

function AssignablePage({data}: {data: AssignablePageData}) {
    return (
        <React.Fragment>
            <LazyLoad>
                <Banner data={data} />
            </LazyLoad>
            <LazyLoad>
                <About data={data} />
            </LazyLoad>
            <LazyLoad>
                <Courses data={data} />
            </LazyLoad>
            <LazyLoad>
                <FAQ data={data} />
            </LazyLoad>
            <LazyLoad>
                <OverlappingQuote data={data} />
            </LazyLoad>
            <LazyLoad>
                <CTA data={data} />
            </LazyLoad>
        </React.Fragment>
    );
}

export default function AssignableLoader() {
    return (
        <main className="assignable page">
            <LoaderPage slug="pages/assignable" Child={AssignablePage} doDocumentSetup />
        </main>
    );
}