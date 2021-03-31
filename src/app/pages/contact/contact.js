import React from 'react';
import {usePageData} from '~/helpers/controller/cms-mixin';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Form from './form.jsx';
import './contact.css';

const slug = 'pages/contact';

export default function ContactPage() {
    const [pageData, statusPage] = usePageData({slug});

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
                    <RawHTML Tag="address" html={mailingAddress} />
                    <RawHTML html={customerService} />
                </div>
            </div>
        </main>
    );
}
