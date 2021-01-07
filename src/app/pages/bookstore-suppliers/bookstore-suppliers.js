import {pageWrapper} from '~/controllers/jsx-wrapper';
import React, {useState, useEffect} from 'react';
import {LoaderPage, RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './bookstore-suppliers.css';

const view = {
    classes: ['bookstore-suppliers', 'page'],
    tag: 'main'
};
const slug = 'pages/print-order';

function providerToModel(p) {
    return {
        name: p.name,
        description: p.blurb || '',
        logoUrl: p.icon,
        buttonUrl: p.url,
        buttonText: p.cta,
        isCanadian: p.canadian
    };
}

function CardFeatures({supplier}) {
    return (
        <React.Fragment>
            <div className="logo-dot">
                <img src={supplier.logoUrl} alt="company logo" />
            </div>
            <h2>{supplier.name}</h2>
            <RawHTML className="blurb" html={supplier.description} />
            <a className="btn primary" href={supplier.buttonUrl}>{supplier.buttonText}</a>
        </React.Fragment>
    );
}

function CanadaFlagCard() {
    return (
        <div className="flag-card">
            <div className="canada-flag">
                <div className="white-field">
                    <FontAwesomeIcon icon={['fab', 'canadian-maple-leaf']} />
                </div>
            </div>
        </div>
    );
}

export function BookstorePage({data}) {
    const suppliers = data.providers.map(providerToModel);
    const featuredSupplier = data.featuredProviders.map(providerToModel); // should only be 1
    const model = {
        headline: data.title,
        subhead: data.introHeading,
        subhead2: data.introDescription,
        featuredSupplier,
        featuredSuppliersBlurb: data.featuredProviderIntroBlurb,
        suppliersBlurb: data.otherProvidersIntroBlurb,
        suppliers
    };

    return (
        <React.Fragment>
            <div className="hero">
                <div className="content">
                    <div className="text">
                        <h1>{model.headline}</h1>
                        <RawHTML className="small-screen" html={model.subhead} />
                        <RawHTML className="larger-screen" html={model.subhead2} />
                    </div>
                </div>
                <div className="images">
                    <img
                        className="desktop-bg"
                        src="/images/bookstore-suppliers/hero-bookstore-print-desktop.png"
                    />
                </div>
            </div>
            <div className="main-content">
                <div className="text-section">
                    <h2>Providers</h2>
                    <div className="intro-blurb">{model.featuredSuppliersBlurb}</div>
                </div>
                {
                    featuredSupplier.map((supplier) =>
                        <div className="card featured" key={supplier}>
                            <CardFeatures supplier={supplier} />
                        </div>
                    )
                }
                <div className="intro-blurb">{model.suppliersBlurb}</div>
                <div className="swipable-row">
                    <div className="cards">
                        {
                            model.suppliers.map((supplier) =>
                                <div className="card" key={supplier}>
                                    {Boolean(supplier.isCanadian) && <CanadaFlagCard />}
                                    <CardFeatures supplier={supplier} />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export function BookstorePageLoader() {
    return (
        <LoaderPage slug={slug} Child={BookstorePage} doDocumentSetup />
    );
}

export default pageWrapper(BookstorePageLoader, view);
