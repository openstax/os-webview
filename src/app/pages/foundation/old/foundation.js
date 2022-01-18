import React from 'react';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './foundation.scss';

const slug = 'pages/foundation';

function FoundationPage({data: model}) {
    return (
        <React.Fragment>
            <div className="hero">
                <div className="text-content">
                    <h1>{model.title}</h1>
                    <p>{model.pageDescription}</p>
                </div>
            </div>
            <div className="blurbs">
                <img
                    className="strips" src="/images/components/strips.svg"
                    height="10" alt="" role="presentation"
                />
                <div className="boxed">
                    {
                        model.funders.map((funder) => (
                            <div className="funder" key={funder}>
                                {funder.title}
                            </div>
                        ))
                    }
                </div>
            </div>
        </React.Fragment>
    );
}

export default function FoundationLoader() {
    return (
        <main className="foundation-page page">
            <LoaderPage slug={slug} Child={FoundationPage} doDocumentSetup />
        </main>
    );
}
