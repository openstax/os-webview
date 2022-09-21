import React from 'react';
import {usePageData} from '~/helpers/controller/cms-mixin';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Form from './form';
import './contact.scss';

const fpdParams = {slug: 'pages/contact'};

export default function ContactPage() {
    const [pageData, statusPage] = usePageData(fpdParams);

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
        <main id="maincontent" className="contact-page page">
            <div className="hero">
                <div className="boxed">
                    <h1>{title}</h1>
                    <p>{tagline}</p>
                </div>
            </div>
            <img className="strips" src="/dist/images/components/strips.svg" height="10" alt="" role="presentation" />
            <div className="boxed left-justified">
                <div className="col form-container">
                    <Form />
                </div>
                <div className="col">
                    <h2>{mailingHeader}</h2>
                    <RawHTML Tag="address" html={mailingAddress} />
                    <RawHTML html={customerService} />
                </div>
            </div>
        </main>
    );
}
