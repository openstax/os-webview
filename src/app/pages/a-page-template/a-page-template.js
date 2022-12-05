import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import './a-page-template.scss';

const slug = 'books/biology-2e';

function Pagename({data: {heading}}) {
    return (
        <div className="content">
            <h1>{heading}</h1>
        </div>
    );
}

export default function PagenameLoader() {
    return (
        <main className="pagename page">
            <LoaderPage slug={slug} Child={Pagename} doDocumentSetup />
        </main>
    );
}
