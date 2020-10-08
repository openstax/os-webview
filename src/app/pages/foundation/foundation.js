import {pageWrapper} from '~/controllers/jsx-wrapper';
import React from 'react';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './foundation.css';

const slug = 'pages/foundation';
const view = {
    classes: ['foundation-page', 'page'],
    tag: 'main'
};

function FoundationPage({data: model}) {
    return (
        <React.Fragment>
            <div className="hero">
                <div className="text-content">
                    <h1>{model.title}</h1>
                    <p>{model.page_description}</p>
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
                                <h2>{funder.title}</h2>
                            </div>
                        ))
                    }
                </div>
            </div>
        </React.Fragment>
    );
}

function FoundationLoader() {
    return (
        <LoaderPage slug={slug} Child={FoundationPage} doDocumentSetup />
    );
}

export default pageWrapper(FoundationLoader, view);
