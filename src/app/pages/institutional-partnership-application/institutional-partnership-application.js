import React, {useState} from 'react';
import {LoaderPage, RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import TabGroup from '~/components/tab-group/tab-group.jsx';
import ContentGroup from '~/components/content-group/content-group.jsx';
import './institutional-partnership-application.scss';

const labels = ['Program details', 'Application'];

function TestimonialBlock({selectedLabel, data}) {
    const testimonials = {
        'Program details': {
            block: data.quote,
            name: data.quoteAuthor,
            address1: data.quoteTitle,
            address2: data.quoteSchool
        },
        'Application': {
            block: data.applicationQuote,
            name: data.applicationQuoteAuthor,
            address1: data.applicationQuoteTitle,
            address2: data.applicationQuoteSchool
        }
    };
    const testimonial = testimonials[selectedLabel];

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

function Application() {
    return (
        <div className="application">
            <iframe
                className="form-iframe"
                src="https://docs.google.com/forms/d/e/1FAIpQLSfI0XpCC-4ag0u9vHizT5w2JLkwcv39HVTZnvQHEtmQj8PJwQ/viewform"
            />
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

function Tabs({model}) {
    const TabTag = 'label';
    const [selectedLabel, setSelectedLabel] = useState(labels[0]);
    const activeIndex = labels.indexOf(selectedLabel);

    return (
        <div className="boxed">
            <div className="tab-controller">
                <TabGroup {...{TabTag, labels, selectedLabel, setSelectedLabel}} />
            </div>
            <div className="tab-content">
                <ContentGroup activeIndex={activeIndex}>
                    <ProgramDetails model={model.programTabContent} />
                    <Application />
                </ContentGroup>
            </div>
        </div>
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
            <Tabs model={data} />
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
