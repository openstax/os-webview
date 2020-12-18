import React, {useEffect} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {RawHTML, LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import linkHelper from '~/helpers/link';
import './llph.css';

function LLPH({data}) {
    const {
        heading: headline,
        subheading: heroBlurb,
        bookHeading: infoHeadline,
        bookDescription: infoHtml,
        bookCoverUrl: coverUrl,
        infoLinkSlug,
        infoLinkText,
        signupLinkText,
        signupLinkHref
    } = data;
    const heroBackground = data.heroBackground.meta.downloadUrl;
    const ostLink = '/openstax-tutor';
    const ostLogo = '/images/llph/tutor-logo.svg';
    const briLink = 'https://billofrightsinstitute.org/';
    const briLogo = '/images/llph/bri-logo.png';
    const loginLocation = new URL(linkHelper.loginLink());

    loginLocation.search = `?r=${encodeURIComponent(signupLinkHref)}&bri_book=LLPH`;

    // Caution: spooky action at a distance
    // Update login menu link
    useEffect(() => {
        const loginMenuLink = document.querySelector('.nav-menu .login-menu a');

        if (loginMenuLink) {
            loginMenuLink.href = loginLocation.href;
        }
    }, [loginLocation.href]);

    return (
        <React.Fragment>
            <section className="hero" style={{backgroundImage: `url('${heroBackground}')`}}>
                <div className="content">
                    <div className="block">
                        <h1>{headline}</h1>
                        <div className="hero-blurb">{heroBlurb}</div>
                        <a className="btn primary" href={loginLocation.href}>{signupLinkText}</a>
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
