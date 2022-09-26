import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCanadianMapleLeaf} from '@fortawesome/free-brands-svg-icons/faCanadianMapleLeaf';
import './bookstore-suppliers.scss';

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
                    <FontAwesomeIcon icon={faCanadianMapleLeaf} />
                </div>
            </div>
        </div>
    );
}

export function BookstorePage({data}) {
    const [
        suppliers,
        featuredSupplier,
        headline,
        subhead,
        subhead2,
        featuredSuppliersBlurb,
        suppliersBlurb
    ] = React.useMemo(
        () => [
            data.providers.map(providerToModel),
            data.featuredProviders.map(providerToModel),
            data.title,
            data.introHeading,
            data.introDescription,
            data.featuredProviderIntroBlurb,
            data.otherProvidersIntroBlurb
        ],
        [data]
    );

    return (
        <React.Fragment>
            <div className="hero">
                <div className="content">
                    <div className="text">
                        <h1>{headline}</h1>
                        <RawHTML className="small-screen" html={subhead} />
                        <RawHTML className="larger-screen" html={subhead2} />
                    </div>
                </div>
                <div className="images">
                    <img
                        className="desktop-bg"
                        src="/dist/images/bookstore-suppliers/hero-bookstore-print-desktop.png"
                        alt=""
                    />
                </div>
            </div>
            <div className="main-content">
                <div className="text-section">
                    <h2>Providers</h2>
                    <div className="intro-blurb">{featuredSuppliersBlurb}</div>
                </div>
                {
                    featuredSupplier.map((supplier) =>
                        <div className="card featured" key={supplier}>
                            <CardFeatures supplier={supplier} />
                        </div>
                    )
                }
                <div className="intro-blurb">{suppliersBlurb}</div>
                <div className="swipable-row">
                    <div className="cards">
                        {
                            suppliers.map((supplier) =>
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

export default function BookstorePageLoader() {
    return (
        <main className="bookstore-suppliers page">
            <LoaderPage slug={slug} Child={BookstorePage} doDocumentSetup />
        </main>
    );
}
