import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useOptimizedImage from '~/helpers/use-optimized-image';
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
    const studentImage = useOptimizedImage(data.studentImage, 600);
    const instructorImage = useOptimizedImage(data.instructorImage, 700);

    return (
        <section className="quotes">
            <div className="boxed">
                <h2>{data.headline}</h2>
            </div>
            <div className="images">
                <img className="left-bg" src={studentImage} alt width="500" height="500" />
                <img className="right-bg" src={instructorImage} alt width="600" height="600" />
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
