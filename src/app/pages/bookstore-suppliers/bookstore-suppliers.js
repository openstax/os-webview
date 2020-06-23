import {pageWrapper} from '~/controllers/jsx-wrapper';
import React, {useState, useEffect} from 'react';
import {usePageData} from '~/helpers/controller/cms-mixin';
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
            <div className="blurb" dangerouslySetInnerHTML={{__html: supplier.description}} />
            <a className="btn primary" href={supplier.buttonUrl}>{supplier.buttonText}</a>
        </React.Fragment>
    );
}

export function Page() {
    const [pageData, statusPage] = usePageData({slug});

    if (statusPage) {
        return statusPage;
    }

    const suppliers = pageData.providers.map(providerToModel);
    const featuredSupplier = pageData.featured_providers.map(providerToModel); // should only be 1
    const model = {
        headline: pageData.title,
        subhead: pageData.intro_heading,
        subhead2: pageData.intro_description,
        featuredSupplier,
        featuredSuppliersBlurb: pageData.featured_provider_intro_blurb,
        suppliersBlurb: pageData.other_providers_intro_blurb,
        suppliers
    };

    return (
        <React.Fragment>
            <div className="hero">
                <div className="content">
                    <div className="text">
                        <h1>{model.headline}</h1>
                        <div className="small-screen" dangerouslySetInnerHTML={{__html: model.subhead}} />
                        <div className="larger-screen" dangerouslySetInnerHTML={{__html: model.subhead2}} />
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
                        <div className="card featured">
                            <CardFeatures supplier={supplier} />
                        </div>
                    )
                }
                <div className="intro-blurb">{model.suppliersBlurb}</div>
                <div className="swipable-row">
                    <div className="cards">
                        {
                            model.suppliers.map((supplier) =>
                                <div className="card">
                                    {
                                        Boolean(supplier.isCanadian) &&
                                            <div className="flag-card">
                                                <div className="canada-flag">
                                                    <div className="white-field">
                                                        <FontAwesomeIcon icon={['fab', 'canadian-maple-leaf']} />
                                                    </div>
                                                </div>
                                            </div>
                                    }
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

export default pageWrapper(Page, view);
