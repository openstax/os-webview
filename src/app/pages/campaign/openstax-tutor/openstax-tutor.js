import React from 'react';
import {LoaderPage, RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './openstax-tutor.css';

function Blurb({icon, title, description}) {
    return (
        <div className="blurb">
            <img src={icon.file} />
            <h3>{title}</h3>
            <RawHTML html={description} />
        </div>
    );
}

function TutorPage({data}) {
    const {
        header: headline, description,
        availableBooksHeader,
        tutorBooks,
        caseStudyFileUrl: buttonUrl, caseStudyCta: buttonText,
        featuresHeader: sectionTitle,
        featuresCards: blurbs,
        otherResourcesText: resourceBlurb,
        otherResourcesLink: resourceUrl,
        otherResourcesCta: resourceText
    } = data;
    const sectionHeader = 'Features';

    return (
        <main className="openstax-tutor">
            <section className="banner hero">
                <div className="boxed">
                    <div className="text">
                        <h1>{headline}</h1>
                        <RawHTML className="description" html={description} />
                        <div className="available-books-header">{availableBooksHeader}</div>
                        <div>
                            {
                                tutorBooks.map((obj) => obj.title).join(', ')
                            }.
                        </div>
                        <a className="btn super" href={buttonUrl}>{buttonText}</a>
                    </div>
                </div>
            </section>
            <div className="color-bar-divider">
                <img className="strips" src="/images/components/strips.svg" height="13" alt="" role="presentation" />
            </div>
            <section className="features">
                <div className="boxed">
                    <header>{sectionHeader}</header>
                    <h2>{sectionTitle}</h2>
                    <div className="blurbs">
                        {blurbs.map((blurb, i) => <Blurb {...blurb} key={i} />)}
                        <div className="resource-blurb">
                            <RawHTML html={resourceBlurb} />
                            <a className="btn primary" href={resourceUrl}>
                                {resourceText}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default function TutorPageLoader() {
    return (
        <LoaderPage slug="pages/tutor-landing" Child={TutorPage} />
    );
}
