import React, {useEffect} from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import linkHelper from '~/helpers/link';
import './llph.scss';

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
    const ostLogo = '/dist/images/llph/tutor-logo.svg';
    const briLink = 'https://billofrightsinstitute.org/';
    const briLogo = '/dist/images/llph/bri-logo.png';
    const loginLocation = new window.URL(linkHelper.loginLink());

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

export default function LLPHLoader() {
    return (
        <main className="llph page">
            <LoaderPage slug="pages/llph" Child={LLPH} doDocumentSetup />
        </main>
    );
}
