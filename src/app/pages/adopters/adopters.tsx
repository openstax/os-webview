import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import './adopters.scss';

const slug = 'adopters';

type Data = {
    name: string;
    description: string;
    website: string;
};

function Adopters({data}: {data: Data[]}) {
    return (
        <main className="adopters-page text-content">
            <h1>Complete list of institutions that have adopted OpenStax</h1>
            <ul className="adopters">
                {data.map((adopter) => (
                    <li className="adopter" key={adopter.website}>
                        {adopter.name}
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default function AdoptersLoader() {
    return <LoaderPage slug={slug} Child={Adopters} doDocumentSetup />;
}
