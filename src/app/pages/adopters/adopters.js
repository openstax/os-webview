import React from 'react';
import {usePageData} from '~/helpers/controller/cms-mixin';
import './adopters.scss';

const slug = 'adopters';

export default function Adopters() {
    const [pageData, statusPage] = usePageData({slug});

    if (statusPage) {
        return statusPage;
    }

    return (
        <main className="adopters-page text-content">
            <h1>Complete list of institutions that have adopted OpenStax</h1>
            <ul className="adopters">
                {
                    pageData.map((adopter) =>
                        <li className="adopter" key={adopter}>{adopter.name}</li>
                    )
                }
            </ul>
        </main>
    );
}
