import {pageWrapper} from '~/controllers/jsx-wrapper';
import React, {useEffect} from 'react';
import {usePageData} from '~/helpers/controller/cms-mixin';
import './adopters.css';

const view = {
    classes: ['adopters-page', 'text-content'],
    tag: 'main'
};
const slug = 'adopters';

function Page() {
    const [pageData, statusPage] = usePageData({slug});

    if (statusPage) {
        return statusPage;
    }

    return (
        <React.Fragment>
            <h1>Complete list of institutions that have adopted OpenStax</h1>
            <ul className="adopters">
                {
                    pageData.map((adopter) =>
                        <li className="adopter" key={adopter}>{adopter.name}</li>
                    )
                }
            </ul>
        </React.Fragment>
    );
}

export default pageWrapper(Page, view);
