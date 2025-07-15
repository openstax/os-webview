import React from 'react';
import Banner from './banner';
import Features from './features';
import StatsGrid from './stats-grid';
import Subjects from './subjects';
import Testimonial from './testimonial';
import FAQ from './faq';
import SignUpForm from './sign-up-form';
import LazyLoad from 'react-lazyload';
import './k12-main.scss';

export type K12Data = {
    bannerRightImage: DownloadableImage;
    bannerHeadline: string;
    bannerDescription: string;
    faqHeader: string;
    faqs: Array<{
        question: string;
        slug: string;
        answer: string;
    }>;
    featuresCards: Array<{
        icon: Icon;
        title: string;
        description: string;
    }>;
    highlightsHeader: string;
    highlights: [
        Array<{
            highlightSubheader: string;
            highlightText: string;
        }>
    ];
    k12library: Record<string, TitleInfo>;
    rfiImage: DownloadableImage;
    rfiHeader: string;
    rfiDescription: string;
    statsGrid: [Array<StatTexts>];
    statsImage1: DownloadableImage;
    statsImage2: DownloadableImage;
    statsImage3: DownloadableImage;
    subjectLibraryDescription: string;
    subjectLibraryHeader: string;
    testimonialsDescription: string;
    testimonialsHeader: string;
    testimonials: Array<TestimonialData>;
};

type DownloadableImage = {
    meta: {downloadUrl: string};
};

export type StatTexts = {
    boldStatText: string;
    normalStatText: string;
};

type Icon = {
    file: string;
    title: string;
};

type TestimonialData = {
    authorIcon: Icon;
    authorName: string;
    authorTitle: string;
    testimonial: string;
};

type TitleInfo = {
    color: string;
    image: string;
    link: string;
    subjectCategory: string;
};

export default function K12({data}: {data: K12Data}) {
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
