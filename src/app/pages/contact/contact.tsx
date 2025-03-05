import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import useDocumentHead from '~/helpers/use-document-head';
import RawHTML from '~/components/jsx-helpers/raw-html';
import Form from './form';
import './contact.scss';

type PageData = {
    title: string;
    tagline: string;
    mailingHeader: string;
    mailingAddress: string;
    customerService: string;
    meta?: {
        searchDescription: string;
    }
}

function ContactPage({data: pageData}: {data: PageData}) {
    const {
        title,
        tagline,
        mailingHeader,
        mailingAddress,
        customerService,
        meta
    } = pageData;

    useDocumentHead({
        title,
        description: meta?.searchDescription
    });

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

export default function ContactPageLoader() {
    return (
        <main id="maincontent" className="contact-page page">
            <LoaderPage slug="pages/contact" Child={ContactPage} />
        </main>
    );
}
