import React from 'react';
import usePageData from '~/helpers/use-page-data';
import './adopters.scss';

export default function Adopters() {
    const pageData = usePageData('adopters');

    if (!pageData) {
        return null;
    }
    if (pageData.error) {
        return (
            <div className="text-content">
                <h1>Data missing in the CMS</h1>
            </div>
        );
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
