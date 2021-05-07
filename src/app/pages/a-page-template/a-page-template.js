import React from 'react';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import ChildComponent from '~/components/a-component-template/a-component-template.js';
import './a-page-template.scss';

const slug = 'books/biology-2e';

function Pagename({data: {heading, message}}) {
    return (
        <div className="content">
            <h1>{heading}</h1>
            {
                message &&
                <ChildComponent message={message} />
            }
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
