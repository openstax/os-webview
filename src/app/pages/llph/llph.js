import React from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {RawHTML, LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import linkHelper from '~/helpers/link';
import './llph.css';

function loginClickHandler(event) {
    event.preventDefault(); // REMOVE THIS!!!
    console.info('Caught a click');
}

function LLPH({data}) {
    const {
        heading: headline,
        subheading: heroBlurb,
        book_heading: infoHeadline,
        book_description: infoHtml,
        book_cover_url: coverUrl,
        info_link_slug: infoLinkSlug,
        info_link_text: infoLinkText,
        signup_link_text: signupLinkText,
        signup_link_href: signupLinkHref
    } = data;
    const heroBackground = data.hero_background.meta.download_url;
    const ostLink = '/openstax-tutor';
    const ostLogo = '/images/llph/tutor-logo.svg';
    const briLink = 'https://billofrightsinstitute.org/';
    const briLogo = '/images/llph/bri-logo.png';
    const loginLocation = new URL(linkHelper.loginLink());

    loginLocation.search = `?r=${encodeURIComponent(signupLinkHref)}&bri_book=LLPH`;

    return (
        <React.Fragment>
            <section className="hero" style={{backgroundImage: `url('${heroBackground}')`}}>
                <div className="content">
                    <div className="block">
                        <h1>{headline}</h1>
                        <div className="hero-blurb">{heroBlurb}</div>
                        <a className="btn primary" href={loginLocation}>{signupLinkText}</a>
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
        <LoaderPage slug="pages/llph" Child={LLPH} doDocumentSetup />
    );
}

const view = {
    classes: ['llph', 'page'],
    tag: 'main'
};

export default pageWrapper(LLPHLoader, view);
