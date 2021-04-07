import React from 'react';
import TutorPage from './openstax-tutor/openstax-tutor';

const pageRoutes = {
    'openstax-tutor': TutorPage
};

function pageSlugFromPath() {
    const slugMatch = window.location.pathname.match(/\/campaign\/(.+)/);

    return slugMatch ? slugMatch[1] : null;
}

export default function DynamicPage() {
    const slug = pageSlugFromPath();
    const Page = pageRoutes[slug];

    return (
        <div className="campaign page">
            <Page />
        </div>
    );
}
