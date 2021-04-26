import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './quotes.scss';

function Quote({className, quote, attribution}) {
    return (
        <div className={className}>
            <RawHTML className="with-big-quote" html={quote} />
            <div className="attribution">
                &ndash; {attribution}
            </div>
        </div>
    );
}

export default function ComponentTemplate({data}) {
    return (
        <section className="quotes">
            <div className="boxed">
                <h2>{data.headline}</h2>
                <div className="side-by-side">
                    <Quote
                        className="student-quote"
                        quote={data.studentQuote}
                        attribution={data.studentAttribution}
                    />
                    <Quote
                        className="instructor-quote"
                        quote={data.instructorQuote}
                        attribution={data.instructorAttribution}
                    />
                </div>
            </div>
            <div className="images">
                <img className="left-bg" src={data.studentImage} alt />
                <img className="right-bg" src={data.instructorImage} alt />
            </div>
        </section>
    );
}
