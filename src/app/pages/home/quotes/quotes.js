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

export default function QuotesSection({data}) {
    const quotes = data.quotes[0];

    return (
        <section className="quotes">
            <div className="boxed">
                <h2>{data.headline}</h2>
            </div>
            <div className="images">
                <img className="left-bg" src={data.studentImage} alt width="400" height="400" />
                <img className="right-bg" src={data.instructorImage} alt width="400" height="400" />
            </div>
            <div className="boxed">
                <div className="side-by-side">
                    <Quote
                        className="student-quote"
                        quote={quotes[0].testimonial}
                        attribution={quotes[0].author}
                    />
                    <Quote
                        className="instructor-quote"
                        quote={quotes[1].testimonial}
                        attribution={quotes[1].author}
                    />
                </div>
            </div>
        </section>
    );
}
