import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import sample from 'lodash/sample';
import './institutional-partnership-application.scss';

type Testimonial = {
    block: string;
    name: string;
    address1: string;
    address2: string;
};

type TestimonialData = {
    quote: string;
    quoteAuthor: string;
    quoteTitle: string;
    quoteSchool: string;
    applicationQuote: string;
    applicationQuoteAuthor: string;
    applicationQuoteTitle: string;
    applicationQuoteSchool: string;
};

type ProgramSection = {
    heading: string;
    description: string;
};

type ApplicationPageData = {
    headingYear: string;
    heading: string;
    programTabContent: [ProgramSection[]];
} & TestimonialData;

function TestimonialBlock({data}: {data: TestimonialData}) {
    const testimonials: Testimonial[] = [
        {
            block: data.quote,
            name: data.quoteAuthor,
            address1: data.quoteTitle,
            address2: data.quoteSchool
        },
        {
            block: data.applicationQuote,
            name: data.applicationQuoteAuthor,
            address1: data.applicationQuoteTitle,
            address2: data.applicationQuoteSchool
        }
    ];
    const testimonial = sample(testimonials);

    return (
        <div className="testimonial">
            <div className="boxed">
                <div className="testimonial-box">
                    <p className="text-block">{testimonial?.block}</p>
                    <div className="writer-info">
                        <p>
                            <strong>-{testimonial?.name}</strong>
                            <br />
                            {testimonial?.address1}
                            <br />
                            {testimonial?.address2}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProgramDetails({model}: {model: [ProgramSection[]]}) {
    return (
        <>
            {model[0].map((section) => (
                <div key={section.heading}>
                    <h2>{section.heading}</h2>
                    <RawHTML html={section.description} />
                </div>
            ))}
        </>
    );
}

function ApplicationPage({data}: {data: ApplicationPageData}) {
    return (
        <React.Fragment>
            <div className="hero">
                <div className="text-block">
                    <p>{data.headingYear}</p>
                    <RawHTML Tag="h1" html={data.heading} />
                </div>
            </div>
            <div className="text-content">
                <ProgramDetails model={data.programTabContent} />
            </div>
            <TestimonialBlock data={data} />
        </React.Fragment>
    );
}

export default function ApplicationLoader() {
    return (
        <main className="institutional-page page">
            <LoaderPage
                slug="pages/institutional-partnership"
                Child={ApplicationPage}
                doDocumentSetup
            />
        </main>
    );
}
