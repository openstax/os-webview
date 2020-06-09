import React from 'react';
import {pageWrapper, SuperbItem} from '~/controllers/jsx-wrapper';
import {fetchPageDataJsx} from '~/helpers/controller/cms-mixin';
import Form from './form.jsx';
import './contact.css';

const view = {
    classes: ['contact-page', 'page']
};
const slug = 'pages/contact';

function Page() {
    const [pageData, statusPage] = fetchPageDataJsx({slug});

    if (statusPage) {
        return statusPage;
    }
    const {
        title,
        tagline,
        mailing_header: mailingHeader,
        mailing_address: mailingAddress,
        customer_service: customerService
    } = pageData;

    return (
        <main id="maincontent">
            <div class="hero">
                <div class="boxed">
                    <h1>{title}</h1>
                    <p>{tagline}</p>
                </div>
            </div>
            <img class="strips" src="/images/components/strips.svg" height="10" alt="" role="presentation" />
            <div class="boxed left-justified">
                <div class="col form-container">
                    <Form />
                </div>
                <div class="col">
                    <h2>{mailingHeader}</h2>
                    <address dangerouslySetInnerHTML={{__html: mailingAddress}} />
                    <div dangerouslySetInnerHTML={{__html: customerService}} />
                </div>
            </div>
        </main>
    );
}

export default pageWrapper(Page, view);
