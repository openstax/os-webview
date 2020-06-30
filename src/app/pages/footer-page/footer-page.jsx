import React, {useState, useEffect} from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {usePageData} from '~/helpers/controller/cms-mixin';
import './footer-page.css';

export default function FooterPage() {
    const slug = `pages${window.location.pathname}`;
    const [data, statusPage] = usePageData({slug});

    if (statusPage) {
        return statusPage;
    }

    const contentFieldName = Reflect.ownKeys(data)
        .find((k) => k.match(/_content$/));
    const {intro_heading: heading, [contentFieldName]: content} = data;

    return (
        <React.Fragment>
            <img className="strips" src="/images/components/strips.svg" height="10" alt="" role="presentation" />
            <main id="maincontent" className="text-content left-justified">
                <RawHTML Tag="h1" html={heading} />
                <RawHTML html={content} />
            </main>
        </React.Fragment>
    );
}
