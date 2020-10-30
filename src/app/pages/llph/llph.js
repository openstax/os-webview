import React from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {RawHTML, LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './llph.css';

function LLPH({data}) {
    const heroBackground = 'https://via.placeholder.com/1440x400/7BB6AE/666666?text=Statue of Liberty';
    const headline = 'A new learning tool for U.S. History';
    const heroBlurb = `Life, Liberty, & the Pursuit of Happiness is a blended learning
    tool for high school students that uses our OpenStax Tutor
    courseware to help students stay engaged while reading and
    doing homework assignments.`;
    const infoHeadline = 'Free for students, aligned with A.P. standards.';
    const infoHtml = `<p>
    Life, Liberty, & the Pursuit of Happiness is based on compelling
    stories that bring American history to life. With OpenStax Tutor, teachers can
    assign reading and homework assignments to their students and take advantage of
    included lesson plans and supporting resources, creating a blended learning tool
    that’s perfect for in class or remote learning.
    </p><p>
    Life, Liberty, and the Pursuit of Happiness is produced through a collaborative
    publishing agreement between OpenStax and the Bill of Rights Institute. The
    course is designed to align with the curriculum guidelines for AP U.S. History
    from the College Board.
    </p>
    `;
    const coverUrl = 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/documents/life_libery_and_the_pursuit_of_happiness_QFfFHz3_cover.svg';
    const infoLinkSlug = 'life-liberty-and-pursuit-happiness';
    const infoLinkText = 'Not an educator? Take a look at the book here.';
    const ostLink = '/openstax-tutor';
    const ostLogo = 'https://via.placeholder.com/194x40/DDDDDD/888833?text=Tutor';
    const briLink = 'https://billofrightsinstitute.org/';
    const briLogo = 'https://via.placeholder.com/110x40/DDDDDD/333388?text=Bill';

    return (
        <React.Fragment>
            <section className="hero" style={{backgroundImage: `url('${heroBackground}')`}}>
                <div className="content">
                    <div className="block">
                        <h1>{headline}</h1>
                        <div className="hero-blurb">{heroBlurb}</div>
                        <a className="btn primary">Sign in to OpenStax Tutor</a>
                    </div>
                </div>
            </section>
            <section className="info">
                <div className="content">
                    <img src={coverUrl} />
                    <div className="book-info">
                        <h2>{infoHeadline}</h2>
                        <RawHTML html={infoHtml} />
                        <a href={`/details/books/${infoLinkSlug}`}>
                            {infoLinkText}
                        </a>
                    </div>
                </div>
            </section>
            <section className="icon-links">
                <div className="content">
                    <a href={ostLink}><img src={ostLogo} alt="OpenStax Tutor" /></a>
                    <a href={briLink}><img src={briLogo} alt="Bill of Rights Institute" /></a>
                </div>
            </section>
        </React.Fragment>
    );
}

function LLPHLoader() {
    return (
        <LoaderPage slug="pages/partners" Child={LLPH} doDocumentSetup />
    );
}

const view = {
    classes: ['llph', 'page'],
    tag: 'main'
};

export default pageWrapper(LLPHLoader, view);
