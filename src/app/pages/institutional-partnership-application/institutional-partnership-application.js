import React from 'react';
import {LoaderPage, RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import sample from 'lodash/sample';
import './institutional-partnership-application.scss';

function TestimonialBlock({data}) {
    const testimonials = [
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
                    <p className="text-block">{testimonial.block}</p>
                    <div className="writer-info">
                        <p>
                            <strong>-{testimonial.name}</strong><br />
                            {testimonial.address1}<br />
                            {testimonial.address2}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProgramDetails({model}) {
    return (
        model[0].map((section) =>
            <div key={section.heading}>
                <h2>{section.heading}</h2>
                <RawHTML html={section.description} />
            </div>
        )
    );
}

function ApplicationPage({data}) {
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
            <TestimonialBlock selectedLabel="Application" data={data} />
        </React.Fragment>
    );
}

export default function ApplicationLoader() {
    return (
        <main className="institutional-page page">
            <LoaderPage
                slug="pages/institutional-partnership" Child={ApplicationPage}
                doDocumentSetup
            />
        </main>
    );
}
