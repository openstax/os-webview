import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import LazyLoad from 'react-lazyload';
import {
    Banner,
    About,
    Courses,
    FAQ,
    CTA
} from './lazy-imports';
import type {BannerData} from './sections/banner/banner';
import './assignable.scss';

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

type AssignablePageData = BannerData & {
    section2Heading: string;
    section2Description: string;
    imageCarousel: [CarouselImage[]];
    availableCoursesHeader: string;
    availableBooks: BookData[];
    coursesComingSoonHeader: string;
    comingSoonBooks: BookData[];
    faqHeader: string;
    faqs: FAQItem[];
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
                <CTA data={data} />
            </LazyLoad>
        </React.Fragment>
    );
}

export default function AssignableLoader() {
    return (
        <main className="assignable page">
            <LoaderPage
                slug="pages/assignable"
                Child={AssignablePage}
                doDocumentSetup
            />
        </main>
    );
}
