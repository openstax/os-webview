import React from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import TutorPage from './openstax-tutor/openstax-tutor';

const pageRoutes = {
    'openstax-tutor': TutorPage
};

function pageSlugFromPath() {
    const slugMatch = window.location.pathname.match(/\/campaign\/(.+)/);

    return slugMatch ? slugMatch[1] : null;
}

function DynamicPage() {
    const slug = pageSlugFromPath();
    const Page = pageRoutes[slug];

    return (
        <Page />
    );
}

export default pageWrapper(DynamicPage, {classes: ['campaign', 'page']});
