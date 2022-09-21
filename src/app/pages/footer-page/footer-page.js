import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {usePageData} from '~/helpers/controller/cms-mixin';
import {useLocation} from 'react-router-dom';
import './footer-page.scss';

const specialSlugFromPath = {
    '/privacy': '/privacy-policy'
};

export default function FooterPage() {
    const {pathname} = useLocation();
    const fpdParams = React.useMemo(
        () => {
            const slugEnd = specialSlugFromPath[pathname] || pathname;

            return {slug: `pages${slugEnd}`};
        },
        [pathname]
    );
    const [data, statusPage] = usePageData(fpdParams);

    if (statusPage) {
        return statusPage;
    }

    const contentFieldName = Reflect.ownKeys(data)
        .find((k) => k.match(/_content$/));
    const {intro_heading: heading, [contentFieldName]: content} = data;

    // Component only renders when location changes, which means new page
    // loads, which means it should go to the top of the page.
    window.scrollTo(0, 0);
    return (
        <div className="footer-page page">
            <img className="strips" src="/dist/images/components/strips.svg" height="10" alt="" role="presentation" />
            <main id="maincontent" className="text-content left-justified">
                <RawHTML Tag="h1" html={heading} />
                <RawHTML html={content} />
            </main>
        </div>
    );
}
